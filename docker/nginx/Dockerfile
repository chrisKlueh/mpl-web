# The first stage
# Build React static files
FROM node:13.12.0-alpine as build

ARG REACT_APP_TURN_SERVER
ARG REACT_APP_TURN_USER
ARG REACT_APP_TURN_PASSWORD
ARG REACT_APP_SIGNALING_SERVER

ENV REACT_APP_TURN_SERVER $REACT_APP_TURN_SERVER
ENV REACT_APP_TURN_USER $REACT_APP_TURN_USER
ENV REACT_APP_TURN_PASSWORD $REACT_APP_TURN_PASSWORD
ENV REACT_APP_SIGNALING_SERVER $REACT_APP_SIGNALING_SERVER

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm ci --silent
COPY ./frontend/ ./
RUN npm run build

# The second stage
# Copy React static files and start nginx
FROM nginx:stable-alpine
COPY --from=build /app/frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]