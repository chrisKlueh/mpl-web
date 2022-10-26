#based on https://pericror.com/software/python-create-a-webrtc-video-stream-from-images

import asyncio
import numpy
import time
import fractions

from typing import Tuple
from av import VideoFrame
from aiortc import VideoStreamTrack
from aiortc.mediastreams import MediaStreamError, VIDEO_CLOCK_RATE, VIDEO_TIME_BASE

from constants import FRAMERATE

VIDEO_PTIME = 1 / FRAMERATE #FRAMERATE fps

class ImageRenderingTrack(VideoStreamTrack):
    def __init__(self):
        super().__init__()
        self.queue = asyncio.Queue(10)
        self.lastFrame = None

    def add_image(self, img: numpy.ndarray):
        try:
            self.queue.put_nowait(VideoFrame.from_ndarray(img, format="bgr24"))
        except asyncio.queues.QueueFull:
            # Discard oldest frame and add current frame since
            # losing an outdated frame is acceptable while losing 
            # the newest one is not.
            self.queue.get_nowait()
            self.queue.put_nowait(VideoFrame.from_ndarray(img, format="bgr24"))

    async def add_image_async(self, img: numpy.ndarray):
        await self.queue.put(VideoFrame.from_ndarray(img, format="bgr24"))

    async def next_timestamp(self) -> Tuple[int, fractions.Fraction]:
        if self.readyState != "live":
            raise MediaStreamError

        if hasattr(self, "_timestamp"):
            self._timestamp += int(VIDEO_PTIME * VIDEO_CLOCK_RATE)
            wait = self._start + (self._timestamp / VIDEO_CLOCK_RATE) - time.time()
            await asyncio.sleep(wait)
        else:
            self._start = time.time()
            self._timestamp = 0
        return self._timestamp, VIDEO_TIME_BASE
    
    async def recv(self):
        if self.lastFrame == None:
            frame = await self.queue.get()

        else:
            try:
                frame = self.queue.get_nowait()
            except asyncio.QueueEmpty:
                frame = self.lastFrame

        pts, time_base = await self.next_timestamp()
        frame.pts = pts
        frame.time_base = time_base
        self.lastFrame = frame
        return frame