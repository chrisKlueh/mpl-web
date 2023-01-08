# docker/signaling/Dockerfile

FROM python:3.8.10

WORKDIR /app/signaling
COPY ./signaling/requirements.txt ./
COPY ./signaling/signaling_server.py ./

RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt

CMD ["python3", "signaling_server.py"]