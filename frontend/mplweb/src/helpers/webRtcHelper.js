import { io } from "socket.io-client";

export const establishSocketConnection = (
  client_io,
  hostId,
  pid,
  pc,
  dataChannel
) => {
  return new Promise((resolve, reject) => {
    console.log("establishing socket connection");
    const myRoom = `instance_${hostId}-${pid}`;
    client_io = io("http://192.168.2.118:8080");
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
        pc = start(client_io, pc, dataChannel, myRoom);

        console.log("after start");
        console.log(pc);

        client_io.on("sdp_answer", (data) => {
          try {
            console.log(data.data);
            let jsonData = JSON.parse(data.data);
            console.log(jsonData);
            pc.setRemoteDescription(jsonData);
          } catch (error) {
            reject(error);
          }
        });

        resolve(myRoom);
      }
    });
  });
};

const negotiate = (client_io, pc, myRoom) => {
  console.log("negotiate");
  console.log(client_io, pc, myRoom);
  pc.addTransceiver("video", { direction: "recvonly" });
  // pc.addTransceiver("audio", { direction: "recvonly" });
  return pc
    .createOffer()
    .then(function (offer) {
      console.log("offer created");
      return pc.setLocalDescription(offer);
    })
    .then(function () {
      // wait for ICE gathering to complete
      return new Promise(function (resolve) {
        if (pc.iceGatheringState === "complete") {
          console.log("ice gathering complete");
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
      console.log("done negotiating");
    });
};

const start = (client_io, pc, dataChannel, myRoom) => {
  const useStun = true;

  console.log("start");
  var config = {
    sdpSemantics: "unified-plan",
  };

  if (useStun) {
    config.iceServers = [{ urls: ["stun:stun.l.google.com:19302"] }];
  }

  pc = new RTCPeerConnection(config);

  // connect audio / video
  pc.addEventListener("track", function (evt) {
    console.log("track");
    console.log(evt);
    console.log(evt.track.kind);
    // if (evt.track.kind == "video") {
    if (evt.track.kind === "video") {
      console.log(evt.streams[0]);
      document.getElementById("video").srcObject = evt.streams[0];
    }
    // else {
    //   document.getElementById("audio").srcObject = evt.streams[0];
    // }
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
    console.log("data channel open: leaving room");
    // connectionResolve("data channel opened");
  };

  dataChannel.onclose = () => {
    console.log("data channel closed");
  };
  console.log("done starting");
  console.log(client_io, pc, dataChannel);
  negotiate(client_io, pc, myRoom);
  return pc;
};

// export const negotiateWebRtc = (client_io, pc, myRoom) => {
//   return new Promise((resolveNegotiate, rejectNegotiate) => {
//     console.log("negotiate");
//     console.log(client_io, pc, myRoom);
//     pc.addTransceiver("video", { direction: "recvonly" });
//     // pc.addTransceiver("audio", { direction: "recvonly" });
//     return pc
//       .createOffer()
//       .then(function (offer) {
//         console.log("offer created");
//         return pc.setLocalDescription(offer);
//       })
//       .then(function () {
//         // wait for ICE gathering to complete
//         return new Promise(function (resolve) {
//           if (pc.iceGatheringState === "complete") {
//             console.log("ice gathering complete");
//             resolve();
//           } else {
//             function checkState() {
//               if (pc.iceGatheringState === "complete") {
//                 pc.removeEventListener("icegatheringstatechange", checkState);
//                 resolve();
//               }
//             }
//             pc.addEventListener("icegatheringstatechange", checkState);
//           }
//         });
//       })
//       .then(function () {
//         var offer = pc.localDescription;
//         client_io.emit("send_offer", {
//           room: myRoom,
//           data: { sdp: offer.sdp, type: offer.type },
//         });
//         console.log("done negotiating");
//         resolveNegotiate("negotiation is over");
//       });
//   });
// };

// export const startWebRtc = (client_io, pc, dataChannel, myRoom) => {
//   const useStun = true;
//   return new Promise((resolve, reject) => {
//     console.log("start");
//     var config = {
//       sdpSemantics: "unified-plan",
//     };

//     if (useStun) {
//       config.iceServers = [{ urls: ["stun:stun.l.google.com:19302"] }];
//     }

//     pc = new RTCPeerConnection(config);

//     // connect audio / video
//     pc.addEventListener("track", function (evt) {
//       console.log("track");
//       console.log(evt);
//       console.log(evt.track.kind);
//       if (evt.track.kind == "video") {
//         console.log(evt.streams[0]);
//         document.getElementById("video").srcObject = evt.streams[0];
//       }
//       // else {
//       //   document.getElementById("audio").srcObject = evt.streams[0];
//       // }
//     });

//     dataChannel = pc.createDataChannel("inputchannel");
//     dataChannel.onerror = (error) => {
//       console.log("data channel error:", error);
//     };

//     dataChannel.onmessage = (event) => {
//       if (event.data instanceof Blob) {
//         const blob = event.data;
//         console.log(blob);
//         //   renderImg(blob);
//       } else {
//         let message = JSON.parse(event.data);
//         console.log("data channel message:", message);
//         console.log(message.type);
//       }
//     };

//     dataChannel.onopen = () => {
//       console.log("data channel opened");
//       const state = dataChannel.readyState;
//       console.log("data channel state:" + state);
//       // addEventListeners();
//       client_io.emit("leave_room", { room: myRoom });
//       console.log("data channel open: leaving room");
//       // connectionResolve("data channel opened");
//     };

//     dataChannel.onclose = () => {
//       console.log("data channel closed");
//     };
//     console.log("done starting");
//     console.log(client_io, pc, dataChannel);
//     resolve();
//     // negotiate();}
//   });
// };

// function stop() {
//   document.getElementById("stop").style.display = "none";

//   // close peer connection
//   setTimeout(function () {
//     pc.close();
//   }, 500);
// }

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
