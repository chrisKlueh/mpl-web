from matplotlib.backend_bases import MouseButton

FRAMERATE = 20

# The duration until an instance self-terminates
# when peer connection is not established
CONNECTION_TIMEOUT_DURATION = 60.0

# The interval in which the refresh token has to be updated
# Needs to be just under the specified value for
# 'SIMPLE_JWT.REFRESH_TOKEN_LIFETIME' in mplweb/settings.py
# 12h = 43200s => update refresh token every 43000s
UPDATE_REFRESH_TOKEN_INTERVAL = 43000.0

# The auth header type prepended to the authorization header
# Needs to match a header type from 'SIMPLE_JWT.AUTH_HEADER_TYPES'
# in mplweb/settings.py
AUTH_HEADER_TYPE = 'JWT'

MESSAGE_TYPES = {
    "MOUSE_MOVE": "mousemove",
    "MOUSE_UP": "mouseup",
    "MOUSE_DOWN": "mousedown",
    "KEY_UP": "keyup",
    "KEY_DOWN": "keydown",
    "WHEEL": "wheel",
    "FIGURE_ENTER": "mouseenter",
    "FIGURE_LEAVE": "mouseleave",
    "REQUEST_SNAPSHOT": "request_snapshot",
    "EXCEPTION": "exception",
}

MPL_MOUSE_BTNS = {
    0: MouseButton.LEFT,
    1: MouseButton.MIDDLE,
    2: MouseButton.RIGHT
}