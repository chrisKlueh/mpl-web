import { io } from "socket.io-client";

let dataChannel;
let pc;
let client_io;
let myRoom;

export const establishSocketConnection = (hostId, pid) => {
  return new Promise((resolve, reject) => {
    console.log("establishing socket connection");
    myRoom = `instance_${hostId}-${pid}`;
    client_io = io("http://192.168.2.118:8080");
    client_io.emit("join_room", { room: myRoom });

    start(resolve);

    client_io.on("connect", () => {
      console.log("connected");
    });

    client_io.on("disconnect", () => {
      console.log("disconnected");
    });

    client_io.on("sdp_answer", (data) => {
      try {
        console.log(data.data);
        let jsonData = JSON.parse(data.data);
        console.log(jsonData);
        // console.log("resolve");
        // resolve("hi");
        pc.setRemoteDescription(jsonData);
      } catch (error) {
        reject(error);
      }
    });
  });
};

function negotiate() {
  pc.addTransceiver("video", { direction: "recvonly" });
  pc.addTransceiver("audio", { direction: "recvonly" });
  return pc
    .createOffer()
    .then(function (offer) {
      return pc.setLocalDescription(offer);
    })
    .then(function () {
      // wait for ICE gathering to complete
      return new Promise(function (resolve) {
        if (pc.iceGatheringState === "complete") {
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
      var offer = pc.localDescription;
      client_io.emit("send_offer", {
        room: myRoom,
        data: { sdp: offer.sdp, type: offer.type },
      });
    });
}

function start(connectionResolve) {
  var config = {
    sdpSemantics: "unified-plan",
  };

  if (document.getElementById("use-stun").checked) {
    config.iceServers = [{ urls: ["stun:stun.l.google.com:19302"] }];
  }

  pc = new RTCPeerConnection(config);

  // connect audio / video
  pc.addEventListener("track", function (evt) {
    console.log("track");
    console.log(evt);
    console.log(evt.track.kind);
    if (evt.track.kind == "video") {
      console.log(evt.streams[0]);
      document.getElementById("video").srcObject = evt.streams[0];
    } else {
      document.getElementById("audio").srcObject = evt.streams[0];
    }
  });

  dataChannel = pc.createDataChannel("inputchannel");
  dataChannel.onerror = (error) => {
    console.log("data channel error:", error);
  };

  dataChannel.onmessage = (event) => {
    if (event.data instanceof Blob) {
      const blob = event.data;
      console.log(blob);
      //   renderImg(blob);
    } else {
      let message = JSON.parse(event.data);
      console.log("data channel message:", message);
      console.log(message.type);
    }
  };

  dataChannel.onopen = () => {
    console.log("data channel opened");
    const state = dataChannel.readyState;
    console.log("data channel state:" + state);
    // addEventListeners();
    client_io.emit("leave_room", { room: myRoom });
    console.log("resolve");
    connectionResolve("data channel opened");
  };

  dataChannel.onclose = () => {
    console.log("data channel closed");
  };

  document.getElementById("start").style.display = "none";
  negotiate();
  document.getElementById("stop").style.display = "inline-block";
}

function stop() {
  document.getElementById("stop").style.display = "none";

  // close peer connection
  setTimeout(function () {
    pc.close();
  }, 500);
}

function send(evtObject) {
  let msg = JSON.stringify(evtObject);
  dataChannel.send(msg);
}

function closeDC() {
  console.log("closing data channel");
  dataChannel.close();
}

// function renderImg(blob) {
//   let urlCreator = window.URL || window.webkitURL;
//   let imgUrl = urlCreator.createObjectURL(blob);
//   videoWindow.src = imgUrl;
// }
