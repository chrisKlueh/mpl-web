export const captureKeyRelated = (event, dataChannel) => {
  if (dataChannel !== null) {
    sendPerDataChannel(trimEvent(event), dataChannel);
  }
};

export const captureMouseRelated = (event, dataChannel) => {
  if (dataChannel !== null) {
    sendPerDataChannel(trimEvent(normalizeMousePos(event)), dataChannel);
  }
};

export const handleContextMenu = (event) => {
  event.preventDefault();
};

const trimEvent = (event) => {
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
};

const normalizeMousePos = (event) => {
  const rect = event.target.getBoundingClientRect();
  const x = Math.floor(event.clientX - rect.left);
  const y = Math.floor(event.clientY - rect.top);
  event.normalizedX = x;
  event.normalizedY = y;
  return event;
};

const sendPerDataChannel = (evtObject, dataChannel) => {
  let msg = JSON.stringify(evtObject);
  console.log(msg);
  dataChannel.send(msg);
};

// function closeDC() {
//   console.log("closing data channel");
//   dataChannel.close();
// }

// function renderImg(blob) {
//   let urlCreator = window.URL || window.webkitURL;
//   let imgUrl = urlCreator.createObjectURL(blob);
//   videoWindow.src = imgUrl;
// }
