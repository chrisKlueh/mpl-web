import { io } from "socket.io-client";
import { saveAs } from "file-saver";

const saveBlobToFile = (blob) => {
  saveAs(blob, "snapshot-" + new Date().toLocaleString("en-GB"));
};

export const establishSocketConnection = (hostId, pid, videoRef) => {
  return new Promise((resolve, reject) => {
    const myRoom = `instance_${hostId}-${pid}`;
    let client_io = io("http://192.168.2.118:8080");
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
        let connectionObj = start(client_io, myRoom, videoRef);

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

const start = (client_io, myRoom, videoRef) => {
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
  let dataChannel = pc.createDataChannel("inputchannel");

  dataChannel.onerror = (error) => {
    console.log("Data channel error:", error);
  };

  dataChannel.onmessage = (event) => {
    if (event.data instanceof Blob) {
      const blob = event.data;
      console.log(blob);
      saveBlobToFile(blob);
      //   renderImg(blob);
    } else {
      let message = JSON.parse(event.data);
      console.log("Data channel message:", message);
      console.log(message.type);
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

// function send(evtObject) {
//   let msg = JSON.stringify(evtObject);
//   dataChannel.send(msg);
// }

// function closeDC() {
//   console.log("closing data channel");
//   dataChannel.close();
// }

// function renderImg(blob) {
//   let urlCreator = window.URL || window.webkitURL;
//   let imgUrl = urlCreator.createObjectURL(blob);
//   videoWindow.src = imgUrl;
// }
