# docker/signaling/Dockerfile

FROM python:3

WORKDIR /app/signaling
COPY ./signaling/requirements.txt ./

RUN pip install --upgrade pip
RUN pip install -r backend/requirements.txt

CMD ["python3", "signaling_server.py"]