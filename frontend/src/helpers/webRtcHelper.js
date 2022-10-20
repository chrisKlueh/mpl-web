import { io } from "socket.io-client";
import { saveAs } from "file-saver";

const SIGNALING_URL = process.env.REACT_APP_SIGNALING_SERVER
  ? process.env.REACT_APP_SIGNALING_SERVER
  : `192.168.2.115:8080`;

const ICE_SERVERS = process.env.REACT_APP_TURN_SERVER
  ? [
      {
        urls: process.env.REACT_APP_TURN_SERVER,
        username: process.env.REACT_APP_TURN_USER,
        credential: process.env.REACT_APP_TURN_PASSWORD,
      },
    ]
  : [{ urls: ["stun:stun.l.google.com:19302"] }];

const CONNECTION_TIMEOUT_DURATION = 60000;
const CONNECTION_TIMEOUT_SIGNALING_STEPS = [
  "Timed out connecting to signaling server",
  "Timed out joining signaling room",
  "Timed out waiting for instance to join signaling room",
  "Signaling timed out in state:",
];
const CONNECTION_TO_SIGNALING_LOST = "Signaling server connection lost";
var connectionTimeoutCause = null;

const saveBlobToFile = (blob) => {
  const fileName = `snapshot_${new Date().toLocaleString("en-GB")}.png`
    .replace(/,\s/g, "_")
    .replace(/:/g, "");
  saveAs(blob, fileName);
};

const updateTimeoutCause = (timeoutCause) => {
  connectionTimeoutCause = timeoutCause;
};

export const establishSocketConnection = (
  instanceId,
  videoRef,
  setErrorDialogDetails,
  setErrorDialogOpen,
  setPeerDisconnected
) => {
  updateTimeoutCause(CONNECTION_TIMEOUT_SIGNALING_STEPS[0]);
  let connectionTimeoutHandle = setTimeout(() => {
    setErrorDialogDetails({
      errorType: "timeout_error",
      description: connectionTimeoutCause,
      generatedDetails: connectionTimeoutCause,
    });
    setErrorDialogOpen(true);
  }, CONNECTION_TIMEOUT_DURATION);
  return new Promise((resolve, reject) => {
    const myRoom = `instance_${instanceId}`;
    console.log("room: " + myRoom);
    let client_io = io(SIGNALING_URL);
    client_io.emit("join_room", { role: "client", room: myRoom });

    client_io.on("connect", () => {
      console.log("connected");
      updateTimeoutCause(CONNECTION_TIMEOUT_SIGNALING_STEPS[1]);
    });

    client_io.on("disconnect", () => {
      console.log("disconnected");
    });

    client_io.on("connect_error", (error) => {
      client_io.close();
      //cancel timeout
      clearTimeout(connectionTimeoutHandle);
      //distinguish between failed initial connection and
      //connection loss afterwards (since the error is ambiguous)
      const connectErrorCause =
        connectionTimeoutCause === CONNECTION_TIMEOUT_SIGNALING_STEPS[0]
          ? CONNECTION_TIMEOUT_SIGNALING_STEPS[0]
          : CONNECTION_TO_SIGNALING_LOST;
      setErrorDialogDetails({
        errorType: "timeout_error",
        description: connectErrorCause,
        generatedDetails:
          connectErrorCause + ` (${error.type}: ${error.message})`,
      });
      setErrorDialogOpen(true);
    });

    client_io.on("joined_room", (data) => {
      const role = data.role;
      if (role === "client") {
        updateTimeoutCause(CONNECTION_TIMEOUT_SIGNALING_STEPS[2]);
        console.log("I joined the room. Waiting for instance..");
      } else if (role === "instance") {
        console.log("Instance joined the room. Starting connection process..");
        let connectionObj = start(
          client_io,
          myRoom,
          videoRef,
          setErrorDialogDetails,
          setErrorDialogOpen,
          setPeerDisconnected,
          connectionTimeoutHandle
        );

        client_io.on("sdp_answer", (data) => {
          try {
            let jsonData = JSON.parse(data.data);
            connectionObj.peerConnection.setRemoteDescription(jsonData);
            resolve({
              socket: client_io,
              peerConnection: connectionObj.peerConnection,
              dataChannel: connectionObj.dataChannel,
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  });
};

const negotiate = (client_io, pc, myRoom) => {
  pc.addTransceiver("video", { direction: "recvonly" });
  return pc
    .createOffer()
    .then(function (offer) {
      return pc.setLocalDescription(offer);
    })
    .then(function () {
      // wait for ICE gathering to complete
      return new Promise(function (resolve) {
        if (pc.iceGatheringState === "complete") {
          console.log("ICE gathering complete");
          resolve();
        } else {
          function checkState() {
            if (pc.iceGatheringState === "complete") {
              pc.removeEventListener("icegatheringstatechange", checkState);
              resolve();
            }
          }
          pc.addEventListener("icegatheringstatechange", checkState);
        }
      });
    })
    .then(function () {
      const offer = pc.localDescription;
      client_io.emit("send_offer", {
        room: myRoom,
        data: { sdp: offer.sdp, type: offer.type },
      });
    });
};

const start = (
  client_io,
  myRoom,
  videoRef,
  setErrorDialogDetails,
  setErrorDialogOpen,
  setPeerDisconnected,
  connectionTimeoutHandle
) => {
  const config = {
    sdpSemantics: "unified-plan",
    iceServers: ICE_SERVERS,
  };

  let pc = new RTCPeerConnection(config);
  // connect video
  pc.addEventListener("track", function (evt) {
    if (evt.track.kind === "video") {
      videoRef.current.srcObject = evt.streams[0];
    }
  });
  pc.onsignalingstatechange = (ev) => {
    if (pc.signalingState === "stable") {
      clearTimeout(connectionTimeoutHandle);
    } else {
      updateTimeoutCause(
        `${CONNECTION_TIMEOUT_SIGNALING_STEPS[3]} ${pc.signalingState}`
      );
    }
  };
  pc.oniceconnectionstatechange = (ev) => {
    console.log(
      "peerConnection.iceconnectionstatechange:" + pc.iceConnectionState
    );
    if (pc.iceConnectionState === "disconnected") {
      setPeerDisconnected(true);
    } else if (
      pc.iceConnectionState === "failed" ||
      pc.iceConnectionState === "closed"
    ) {
      setErrorDialogDetails({
        errorType: "peer_connection_error",
        description: `iceConnectionState: ${pc.iceConnectionState}`,
        generatedDetails: `Peer connection lost (iceConnectionState: ${pc.iceConnectionState}).`,
      });
      setErrorDialogOpen(true);
    }
  };

  let dataChannel = pc.createDataChannel("inputchannel");

  dataChannel.onerror = (error) => {
    console.log("Data channel error:", error);
  };

  dataChannel.onmessage = (event) => {
    if (event.data instanceof Blob) {
      const blob = event.data;
      saveBlobToFile(blob);
    } else {
      let message = JSON.parse(event.data);
      if (message.type && message.type === "exception") {
        setErrorDialogDetails({
          errorType: "demo_error",
          description: message.description,
          generatedDetails: message.stacktrace,
        });
        setErrorDialogOpen(true);
      } else {
        console.log("Data channel message:", message);
      }
    }
  };

  dataChannel.onopen = () => {
    console.log("Data channel opened");
    const state = dataChannel.readyState;
    console.log("Data channel state:" + state);
    // addEventListeners();
    client_io.emit("leave_room", { room: myRoom });
    client_io.disconnect();
  };

  dataChannel.onclose = () => {
    console.log("Data channel closed");
  };
  negotiate(client_io, pc, myRoom);
  return { peerConnection: pc, dataChannel: dataChannel };
};

export const stopPeerConnection = (peerConnection) => {
  return new Promise((resolve, reject) => {
    // close peer connection
    peerConnection.close();
    if (peerConnection.signalingState === "closed") {
      resolve(peerConnection);
    } else {
      reject(peerConnection);
    }
  });
};
