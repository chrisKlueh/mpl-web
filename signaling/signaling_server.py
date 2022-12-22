import socketio
from aiohttp import web
from datetime import datetime

server_io = socketio.AsyncServer(async_mode='aiohttp', cors_allowed_origins='*')
app = web.Application()
server_io.attach(app)

@server_io.event
async def connect(sid, socket):    
    print(datetime.now() , ":", sid, 'connected', "\n")
    await server_io.emit("you_connected", to=sid)

@server_io.event
async def disconnect(sid):
    print(datetime.now() , ":", sid, 'disconnected', "\n")
    await server_io.emit("you_disconnected", to=sid)

@server_io.event
async def join_room(sid, data):
    room = data["room"]
    print(datetime.now() , ":", "sid", sid, "joined room", room, "\n")
    print(data)
    server_io.enter_room(sid, room)
    await server_io.emit("joined_room", {"role": data["role"]}, room=room)

@server_io.event
def leave_room(sid, data):
    room = data["room"]
    print(datetime.now() , ":", "sid", sid, "left room", room, "\n")
    server_io.leave_room(sid, room)

@server_io.event
async def send_offer(sid, data):
    print(datetime.now() , ":", sid, ":\n", data, "\n")
    await server_io.emit("sdp_offer", {"data": data["data"]}, room=data["room"])

@server_io.event
async def send_answer(sid, data):
    print(datetime.now() , ":", sid, ":\n", data, "\n")
    await server_io.emit("sdp_answer", {"data": data["data"]}, room=data["room"])

if __name__ == '__main__':
    web.run_app(app)