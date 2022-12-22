# Hosts a web server, sends the camera's video to it
# via WebRTC, receives captured input from the browser via 
# WebRTC and forwards these inputs to the running demo 
# instance via matplotlib events.

# Based on aiortc/examples/webcam/webcam.py; modified

import argparse
import asyncio
import json
import logging
import os
import ssl
import io
import socketio
import traceback
import requests

from  threading import Timer
from importlib import import_module
from aiortc import RTCPeerConnection, RTCSessionDescription, RTCConfiguration, RTCIceServer
from aiortc.rtcrtpsender import RTCRtpSender
from matplotlib import use
import numpy as np

from constants import FRAMERATE, CONNECTION_TIMEOUT_DURATION, UPDATE_REFRESH_TOKEN_INTERVAL, AUTH_HEADER_TYPE, MESSAGE_TYPES, MPL_MOUSE_BTNS
from imageRenderingTrack import ImageRenderingTrack
import MPLDemo

ROOT = os.path.dirname(__file__)

if not (os.environ.get('DJANGO_ALLOWED_HOSTS') == None):
    print("Using docker params: API_URL")
    API_URL = "http://" + os.environ.get('DJANGO_ALLOWED_HOSTS').split(' ')[0] + "/api/"#docker
else:
    print("Using dev params: API_URL")
    API_URL = "http://192.168.2.115:8000/api/"#dev

if not (os.environ.get('DJANGO_TURN_SERVER') == None or os.environ.get('DJANGO_TURN_USER') == None or os.environ.get('DJANGO_TURN_PASSWORD') == None):
    print("Using docker params: ICE_SERVERS")
    ICE_SERVERS = [RTCIceServer(os.environ.get('DJANGO_TURN_SERVER'), os.environ.get('DJANGO_TURN_USER'), os.environ.get('DJANGO_TURN_PASSWORD'))]#docker
else:
    print("Using dev params: ICE_SERVERS")
    ICE_SERVERS = [RTCIceServer("stun:stun.1.google.com:19302")]#dev

if not (os.environ.get('DJANGO_SIG_HOST') == None):
    print("Using docker params: SIG_HOST")
    SIG_HOST = os.environ.get('DJANGO_SIG_HOST')
else:
    print("Using dev params: SIG_HOST")
    SIG_HOST = "192.168.2.115:8080"

# Use non-interactive backend to run the mpl demo
use("Agg")

class RemotePlotStream(object):
    def __init__(self, demo, instance_id, group_id, refresh_token) -> None:
        self.instanceId = instance_id
        self.groupId = group_id
        self.refreshToken = refresh_token
        self.establishSocketConnection(self.instanceId)
        self.pcs = set()
        self.initDemo(demo)
        self.timeout = Timer(CONNECTION_TIMEOUT_DURATION, self.terminateSelf, ["Timed out during signaling"])
        self.timeout.start()
        self.updateRefreshTokenInterval = Timer(UPDATE_REFRESH_TOKEN_INTERVAL, self.updateRefreshToken, [False])
        self.updateRefreshTokenInterval.start()


    def terminateSelf(self, reason):
        print("\n######################")
        print("My time has come...")
        print("Reason: " + reason)
        print("######################\n")
        authHeader = self.getAuthorizedHeader()
        if not (authHeader == None):
            requestUrl = API_URL + "instances/" + str(self.instanceId)
            formData = {"group_id": self.groupId}
            terminateResponse = requests.delete(requestUrl, headers=authHeader, json = formData)
        else:
            # terminate self anyways via os.kill?
            print("Could not obtain auth header")

    def updateRefreshToken(self, returnResponse):
        requestUrl = API_URL + "token/refresh/"
        formData = {"refresh": self.refreshToken}
        response = requests.post(requestUrl, json = formData)
        if response.status_code == 200:
            responseObject = json.loads(response.text)
            self.refreshToken = responseObject["refresh"]
            self.updateRefreshTokenInterval = Timer(UPDATE_REFRESH_TOKEN_INTERVAL, self.updateRefreshToken, [False])
            self.updateRefreshTokenInterval.start()
            print("Refresh token updated")
            if returnResponse == True:
                return responseObject
        else:
            print("Failed to update refresh token")

    def getAuthorizedHeader(self):
        updatedTokenObject = self.updateRefreshToken(True)
        if not (updatedTokenObject == None):
            return {"Authorization": AUTH_HEADER_TYPE + " " + updatedTokenObject["access"]}     

    def establishSocketConnection(self, instance_id):
        loop = asyncio.get_event_loop()
        self.sio = socketio.Client()
        self.sig_room = "instance_" + str(instance_id)
        print(self.sig_room)
        sigaling_server_url = "http://" + SIG_HOST
        try:
            self.sio.connect(sigaling_server_url)
            print("Connected with socket " + sigaling_server_url)
            self.sio.emit("join_room", {"role": "instance", "room": self.sig_room})
            print("Joined room " + self.sig_room)

            @self.sio.event
            def connect():
                print("Reconnected with socket " + sigaling_server_url)

            @self.sio.event
            def disconnect():
                print("Disconnected from socket " + sigaling_server_url)

            @self.sio.event
            def connect_error(data):
                self.terminateSelf("Signaling server connection lost")

            @self.sio.event
            def sdp_offer(data):
                answer = loop.run_until_complete(self.offer(data))
                self.sio.emit("send_answer", {"room": self.sig_room, "data": answer})
                loop.run_forever()
        
        except socketio.exceptions.ConnectionError as error:
            print("\nFailed to connect to signaling server:")
            print(error)
            self.terminateSelf("Timed out connecting to signaling server")
    
    def initDemo(self, demo):
        self.demo = demo
        self.demoFig = self.demo.getFig()
        self.plotWidth, self.plotHeight = self.demoFig.canvas.get_width_height()
        self.clientWidth = 0
        self.clientHeight = 0
        self.widthFactor = 1
        self.heightFactor = 1
        # subscribe to the draw event
        self.cid = self.demoFig.canvas.mpl_connect('draw_event', self.onUpdatePlot)

    def force_codec(self, pc, sender, forced_codec):
        kind = forced_codec.split("/")[0]
        codecs = RTCRtpSender.getCapabilities(kind).codecs
        print(codecs)
        transceiver = next(t for t in pc.getTransceivers() if t.sender == sender)
        transceiver.setCodecPreferences(
            [codec for codec in codecs if codec.mimeType == forced_codec]
        )

    async def offer(self, message):
        offer = RTCSessionDescription(sdp=message["data"]["sdp"], type=message["data"]["type"])
        config = RTCConfiguration(ICE_SERVERS)
        pc = RTCPeerConnection(configuration=config)
        self.pcs.add(pc)

        @pc.on("datachannel")
        def on_datachannel(channel):
            self.channel = channel
            self.channel_log(channel, "-", "created by remote party")

            @channel.on("message")
            def on_message(message):
                if isinstance(message, str):
                    messageObj = json.loads(message)
                    self.handleMessage(messageObj)

            @channel.on("close")
            def on_close():
                print("data channel was closed")

        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
            print("Connection state is %s" % pc.connectionState)
            if pc.connectionState == "failed":
                await pc.close()
                self.pcs.discard(pc)
                self.terminateSelf("Peer connection failed")
            elif pc.connectionState == "closed":
                self.terminateSelf("Peer connection closed")
                #os._exit(0)
            elif pc.connectionState == "connected":
                #cancel timeout for self-termination
                self.timeout.cancel()
                print("\nPeer connection established. Stopping self-termination timeout.\n")
                #leave room
                self.sio.emit("leave_room", {"room": self.sig_room})
                #start video stream by adding the first frame to its queue
                self.onUpdatePlot(None)
                self.sio.disconnect()
                
        self.imageRenderingTrack = ImageRenderingTrack()
        print(f"\nRecording plot with {self.plotWidth}x{self.plotHeight}@{FRAMERATE}fps\n")
        video_sender = pc.addTrack(self.imageRenderingTrack)
        
        if args.video_codec:
            self.force_codec(pc, video_sender, args.video_codec)
        elif args.play_without_decoding:
            raise Exception(
                "You must specify the video codec using --video-codec")

        await pc.setRemoteDescription(offer)
        answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        
        return json.dumps({"sdp": pc.localDescription.sdp, "type": pc.localDescription.type})

    def channel_log(self, channel, t, message):
        print("channel(%s) %s %s" % (channel.label, t, message))

    def channel_send(self, channel, message):
        #self.channel_log(channel, ">", message)
        channel.send(message)

    def handleMessage(self, messageObj):
        try:
            if messageObj["type"] == MESSAGE_TYPES["MOUSE_MOVE"]:
                self.checkClientPlotDimensions(messageObj["clientWidth"], messageObj["clientHeight"])
                self.demoFig.canvas.motion_notify_event(self.calcX(messageObj["normalizedX"]), self.calcY(messageObj["normalizedY"]))
            elif messageObj["type"] == MESSAGE_TYPES["MOUSE_DOWN"]:
                self.checkClientPlotDimensions(messageObj["clientWidth"], messageObj["clientHeight"])
                self.demoFig.canvas.button_press_event(self.calcX(messageObj["normalizedX"]), self.calcY(messageObj["normalizedY"]), button=MPL_MOUSE_BTNS[messageObj["button"]])
            elif messageObj["type"] == MESSAGE_TYPES["MOUSE_UP"]:
                self.checkClientPlotDimensions(messageObj["clientWidth"], messageObj["clientHeight"])
                self.demoFig.canvas.button_release_event(self.calcX(messageObj["normalizedX"]), self.calcY(messageObj["normalizedY"]), button=MPL_MOUSE_BTNS[messageObj["button"]])
            elif messageObj["type"] == MESSAGE_TYPES["KEY_DOWN"]:
                self.demoFig.canvas.key_press_event(messageObj["key"])
            elif messageObj["type"] == MESSAGE_TYPES["KEY_UP"]:
                self.demoFig.canvas.key_release_event(messageObj["key"])
            elif messageObj["type"] == MESSAGE_TYPES["WHEEL"]:
                self.checkClientPlotDimensions(messageObj["clientWidth"], messageObj["clientHeight"])
                self.demoFig.canvas.scroll_event(self.calcX(messageObj["normalizedX"]), self.calcY(messageObj["normalizedY"]), step=self.calcStep(messageObj["deltaY"]))
            elif messageObj["type"] == MESSAGE_TYPES["FIGURE_ENTER"]:
                self.checkClientPlotDimensions(messageObj["clientWidth"], messageObj["clientHeight"])
                self.demoFig.canvas.enter_notify_event(xy=(self.calcX(messageObj["normalizedX"]), self.calcY(messageObj["normalizedY"])))
            elif messageObj["type"] == MESSAGE_TYPES["FIGURE_LEAVE"]:
                self.checkClientPlotDimensions(messageObj["clientWidth"], messageObj["clientHeight"])
                self.demoFig.canvas.leave_notify_event()
            elif messageObj["type"] == MESSAGE_TYPES["REQUEST_SNAPSHOT"]:
                self.onSaveSnapshot()
        except Exception as e:
            stackTrace = ''.join(traceback.format_exception(None, e, e.__traceback__))
            print("\nAn exception occurred when processing input:", stackTrace, "\n")
            self.channel_send(self.channel, json.dumps({"type": MESSAGE_TYPES["EXCEPTION"], "description": str(e), "stacktrace": stackTrace}))

    def calcStep(self, deltaY):
        step = 1
        if deltaY < 0:
            step = -1
        return step

    def calcX(self, clientX):
        return round(self.widthFactor * clientX)

    def calcY(self, clientY):
        return self.plotHeight - round(self.heightFactor * clientY)

    def checkClientPlotDimensions(self, clientWidth, clientHeight):
        if not (self.clientWidth == clientWidth):
            self.clientWidth = clientWidth
            self.widthFactor = self.plotWidth / self.clientWidth
        if not (self.clientHeight == clientHeight):
            self.clientHeight = clientHeight
            self.heightFactor = self.plotHeight / self.clientHeight

    def onUpdatePlot(self, event):
        print("\nPlot has updated. Sending new image.\n")
        self.demoFig.canvas.mpl_disconnect(self.cid)
        with io.BytesIO() as imgBuff:
            self.demoFig.savefig(imgBuff, format="raw")
            imgBuff.seek(0)
            data = np.frombuffer(imgBuff.getvalue(), dtype=np.uint8)
            im = data.reshape(self.plotHeight, self.plotWidth, -1)
            #convert BGRA to RGB and send to virtual cam
            currentFrame = np.flip(im[:, :, :3], 2)
            self.imageRenderingTrack.add_image(currentFrame)
        # subscribe to the draw event once again
        self.cid = self.demoFig.canvas.mpl_connect('draw_event', self.onUpdatePlot)

    def onSaveSnapshot(self):
        print("\nPlot snapshot requested. Sending blob.\n")
        # stop listending to the draw event to prevent infinite 
        # calls of this eventHandler (caused by savefig)
        self.demo.fig.canvas.mpl_disconnect(self.cid)
        with io.BytesIO() as buff:
            self.demo.fig.savefig(buff, format="png")
            buff.seek(0)
            data = buff.getvalue()
        # subscribe to the draw event once again
        self.cid = self.demo.fig.canvas.mpl_connect('draw_event', self.onUpdatePlot)
        #send image via data channel
        self.channel_send(self.channel, data)


def add_args():
    parser = argparse.ArgumentParser(description="WebRTC webcam demo")
    parser.add_argument("--cert-file", help="SSL certificate file (for HTTPS)")
    parser.add_argument("--key-file", help="SSL key file (for HTTPS)")
    parser.add_argument(
        "--play-from", help="Read the media from a file and sent it."),
    parser.add_argument(
        "--play-without-decoding",
        help=(
            "Read the media without decoding it (experimental). "
            "For now it only works with an MPEGTS container with only H.264 video."
        ),
        action="store_true",
    )
    parser.add_argument(
        "--host", default="0.0.0.0", help="Host for HTTP server (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port", type=int, default=8080, help="Port for HTTP server (default: 8080)"
    )
    parser.add_argument("--verbose", "-v", action="count")
    parser.add_argument(
        "--audio-codec", help="Force a specific audio codec (e.g. audio/opus)"
    )
    parser.add_argument(
        "--video-codec", help="Force a specific video codec (e.g. video/H264)"
    )
    parser.add_argument("--demo", help="The filename of the demo (without .py)", required=True)
    parser.add_argument("--instance_id", help="The instance's id", required=True)
    parser.add_argument("--group_id", help="The instance owner's group", required=True)
    parser.add_argument("--refresh_token", help="The refresh token required for self-termination", required=True)

    return parser.parse_args()

if __name__ == "__main__":
    args = add_args()

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    if args.cert_file:
        ssl_context = ssl.SSLContext()
        ssl_context.load_cert_chain(args.cert_file, args.key_file)
    else:
        ssl_context = None

        demoModule = import_module("." + args.demo, "demo_files")
        demo = demoModule.Demo(blocking=False)
        
        remotePlotStream = RemotePlotStream(demo, args.instance_id, args.group_id, args.refresh_token)