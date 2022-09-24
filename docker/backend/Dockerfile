# docker/backend/Dockerfile

FROM python:3.8.3-alpine

WORKDIR /app
ADD ./backend/requirements.txt /app/backend/


RUN pip3 install --upgrade pip
RUN pip3 install gunicorn
RUN pip3 install -r backend/requirements.txt

ADD ./docker /app/docker
ADD ./backend /app/backend