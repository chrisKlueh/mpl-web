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
        clientWidth: event.srcElement.clientWidth,
        clientHeight: event.srcElement.clientHeight,
      };
      break;
    case "mousedown":
      trimmedEvent = {
        type: event.type,
        button: event.button,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
        clientWidth: event.srcElement.clientWidth,
        clientHeight: event.srcElement.clientHeight,
      };
      break;
    case "mouseup":
      trimmedEvent = {
        type: event.type,
        button: event.button,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
        clientWidth: event.srcElement.clientWidth,
        clientHeight: event.srcElement.clientHeight,
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
        clientWidth: event.srcElement.clientWidth,
        clientHeight: event.srcElement.clientHeight,
      };
      break;
    case "mouseenter":
      trimmedEvent = {
        type: event.type,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
        clientWidth: event.srcElement.clientWidth,
        clientHeight: event.srcElement.clientHeight,
      };
      break;
    case "mouseleave":
      trimmedEvent = {
        type: event.type,
        normalizedX: event.normalizedX,
        normalizedY: event.normalizedY,
        clientWidth: event.srcElement.clientWidth,
        clientHeight: event.srcElement.clientHeight,
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
  dataChannel.send(msg);
};

export const requestSnapshot = (dataChannel) => {
  sendPerDataChannel({ type: "request_snapshot" }, dataChannel);
};
