import { io } from "socket.io-client";
import { saveAs } from "file-saver";

const saveBlobToFile = (blob) => {
  const fileName = `snapshot_${new Date().toLocaleString("en-GB")}.png`
    .replace(/\,\s/g, "_")
    .replace(/\:/g, "");
  saveAs(blob, fileName);
};

export const establishSocketConnection = (
  hostId,
  pid,
  videoRef,
  setErrorDialogDetails,
  setErrorDialogOpen,
  setPeerDisconnected
) => {
  return new Promise((resolve, reject) => {
    const myRoom = `instance_${hostId}-${pid}`;
    //let client_io = io(`${window.location.origin}:8080`);
    let client_io = io(`192.168.2.115:8080`);
    client_io.emit("join_room", { role: "client", room: myRoom });

    client_io.on("connect", () => {
      console.log("connected");
    });

    client_io.on("disconnect", () => {
      console.log("disconnected");
    });

    client_io.on("joined_room", (data) => {
      const role = data.role;
      if (role === "client") {
        console.log("I joined the room. Waiting for instance..");
      } else if (role === "instance") {
        console.log("Instance joined the room. Starting connection process..");
        let connectionObj = start(
          client_io,
          myRoom,
          videoRef,
          setErrorDialogDetails,
          setErrorDialogOpen,
          setPeerDisconnected
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
  setPeerDisconnected
) => {
  const config = {
    sdpSemantics: "unified-plan",
    //always use stun servers
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
  };

  let pc = new RTCPeerConnection(config);
  // connect video
  pc.addEventListener("track", function (evt) {
    if (evt.track.kind === "video") {
      videoRef.current.srcObject = evt.streams[0];
    }
  });
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
