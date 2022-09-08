from matplotlib.backend_bases import MouseButton

FRAMERATE = 20

MESSAGE_TYPES = {
    "MOUSE_MOVE": "mousemove",
    "MOUSE_UP": "mouseup",
    "MOUSE_DOWN": "mousedown",
    "KEY_UP": "keyup",
    "KEY_DOWN": "keydown",
    "WHEEL": "wheel",
    "FIGURE_ENTER": "mouseenter",
    "FIGURE_LEAVE": "mouseleave",
}

MPL_MOUSE_BTNS = {
    0: MouseButton.LEFT,
    1: MouseButton.MIDDLE,
    2: MouseButton.RIGHT
}