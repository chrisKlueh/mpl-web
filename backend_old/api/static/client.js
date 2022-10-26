var pc = null;
let btnCloseDC = document.getElementById("closeDC");
let videoWindow = document.getElementById("video");

let dataChannel = null;

function captureKeydown(event) {
  if (dataChannel !== null) {
    send(trimEvent(event));
  }
}

function captureKeyup(event) {
  if (dataChannel !== null) {
    send(trimEvent(event));
  }
}

function captureMousedown(event) {
  if (dataChannel !== null) {
    send(trimEvent(normalizeMousePos(event)));
  }
}

function captureMouseup(event) {
  if (dataChannel !== null) {
    send(trimEvent(normalizeMousePos(event)));
  }
}

function captureMousemove(event) {
  if (dataChannel !== null) {
    send(trimEvent(normalizeMousePos(event)));
  }
}

function captureMousewheel(event) {
  if (dataChannel !== null) {
    send(trimEvent(normalizeMousePos(event)));
  }
}

function captureFigureEnter(event) {
  if (dataChannel !== null) {
    send(trimEvent(normalizeMousePos(event)));
  }
}

function captureFigureLeave(event) {
  if (dataChannel !== null) {
    send(trimEvent(normalizeMousePos(event)));
  }
}

function handleContextMenu(event) {
  event.preventDefault();
}

function trimEvent(event) {
  let trimmedEvent = null;
  switch (event.type) {
    case "mousemove":
      trimmedEvent = {
        type: event.type,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
      };
      break;
    case "mousedown":
      trimmedEvent = {
        type: event.type,
        button: event.button,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
      };
      break;
    case "mouseup":
      trimmedEvent = {
        type: event.type,
        button: event.button,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
      };
      break;
    case "keydown":
      trimmedEvent = {
        type: event.type,
        key: event.key,
        code: event.code,
      };
      break;
    case "keyup":
      trimmedEvent = {
        type: event.type,
        key: event.key,
        code: event.code,
      };
      break;
    case "wheel":
      trimmedEvent = {
        type: event.type,
        deltaY: event.deltaY,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
      };
      break;
    case "mouseenter":
      trimmedEvent = {
        type: event.type,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
      };
      break;
    case "mouseleave":
      trimmedEvent = {
        type: event.type,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
      };
      break;
    default:
      break;
  }
  return trimmedEvent ? trimmedEvent : event;
}

function normalizeMousePos(event) {
  const rect = event.target.getBoundingClientRect();
  const x = Math.floor(event.clientX - rect.left);
  const y = Math.floor(event.clientY - rect.top);
  event.normalizedX = x;
  event.normalizedY = y;
  return event;
}

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
      return fetch("/offer", {
        body: JSON.stringify({
          sdp: offer.sdp,
          type: offer.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (answer) {
      return pc.setRemoteDescription(answer);
    })
    .catch(function (e) {
      alert(e);
    });
}

function start() {
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
    if (evt.track.kind == "video") {
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
      renderImg(blob);
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
    addEventListeners();
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

function renderImg(blob) {
  let urlCreator = window.URL || window.webkitURL;
  let imgUrl = urlCreator.createObjectURL(blob);
  videoWindow.src = imgUrl;
}

function addEventListeners() {
  videoWindow.addEventListener("mouseenter", (event) => {
    window.addEventListener("keydown", captureKeydown);
    window.addEventListener("keyup", captureKeyup);
    videoWindow.addEventListener("mousemove", captureMousemove);
    videoWindow.addEventListener("mousedown", captureMousedown);
    videoWindow.addEventListener("mouseup", captureMouseup);
    videoWindow.addEventListener("wheel", captureMousewheel);
    videoWindow.addEventListener("contextmenu", handleContextMenu);
  });
  videoWindow.addEventListener("mouseleave", (event) => {
    window.removeEventListener("keydown", captureKeydown);
    window.removeEventListener("keyup", captureKeyup);
    videoWindow.removeEventListener("mousemove", captureMousemove);
    videoWindow.removeEventListener("mousedown", captureMousedown);
    videoWindow.removeEventListener("wheel", captureMousewheel);
    videoWindow.removeEventListener("contextmenu", handleContextMenu);
  });
  videoWindow.addEventListener("mouseenter", captureFigureEnter);
  videoWindow.addEventListener("mouseleave", captureFigureLeave);
}
