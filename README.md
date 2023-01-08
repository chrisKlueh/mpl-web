# mplWeb

## Prototypische Webanwendung zur Bereitstellung interaktiver Matplotlib-Demos unter Verwendung von WebRTC

Angefertigt im Rahmen meiner Masterthesis _"Entwurf und Implementierung einer Webanwendung zur Bereitstellung interaktiver Matplotlib-Demos unter Verwendung von WebRTC"_.

### Verwendungszweck

Diese Anwendung ermöglicht die interaktive Nutzung bestehender Matplotlib-Demo-Programme per Webbrowser mit Hilfe von WebRTC.
Nutzer können ihre eigene Instanz einer Matplotlib-Demo starten und mit ihr interagieren, sofern die Demo interaktiv ist.
Dabei erfasst das Frontend Events im Browser und überträgt sie per WebRTC-Data Channel an die entsprechende Demo-Instanz.
Diese übersetzt die erhaltenen Events in die entsprechenden Matplotlib-Events und löst sie anschließend aus.
Der Plot der Matplotlib-Demo wird per WebRTC-Video Track an den Browser des Nutzers übertragen.

In der Konsequenz können Nutzer die Matplotlib-Demos direkt über ihren Browser verwenden, ohne auf ihrem lokalen Endgerät die Programmumgebung der Demos einzurichten.

Die Anwendung stellt zudem diverse Verwaltungsfunktionen bereit, die von privilegierten Nutzern über das React-Frontend verwendet werden können.

### Unterstützte Matplotlib-Events

Matplotlib-Demos können Benutzerinteraktion über die folgenden Events realisieren:

- `button_press_event`/ `button_release_event`
- `key_press_event`/ `key_release_event`
- `figure_enter_event`/ `figure_leave_event`
- `axes_enter_event`/ `axes_leave_event`
- `motion_notify_event`
- `scroll_event`
- `draw_event`
- `pick_event`

### Unterstützte Endgeräte bzw. Browser

Grundsätzlich kann die Anwendung von jedem Gerät aus genutzt werden, das über einen Webbrowser verfügt.
Mobile Endgeräte (Smartphones, Tablets) sind ebenfalls nutzbar, allerdings ist der Umfang der Interaktion eingeschränkt, sofern keine Eingabegeräte für Maus- bzw. Tastatur-Events verwendet werden.

Die Anwendung wurde primär für Firefox entwickelt, jedoch auch für Chrome und Edge getestet und sollte daher mindestens diese drei Browser unterstützen.

### Tech-Stack

Die Anwendung besteht aus den folgenden Komponenten:

- Frontend (React)
- REST-API (Django)
- Datenbank (SQLite)
- WebSocket-Signaling-Server (Python, u.a. aiohttp, python-socketio)
- TURN-Server (Coturn)
- Wrapper-Skript für Matplotlib-Demos (Python, u.a. aiortc)

### Deployment

Ein Zielrechner benötigt für das Deployment der Anwendung **Docker** und **Docker Compose**.
Die Docker-Infrastruktur der Anwendung wird in der Datei `docker-compose-dev.yml` definiert.

In den folgenden Dateien müssen Parameter vor dem Deployment angepasst werden:

- `docker-compose-dev.yml`
- `docker/nginx/development/default.conf`
- `docker/coturn/turnserver.conf`
  Zudem müssen ggfs. diverse Ports in der Zielumgebung für die Nutzung geöffnet werden.
  Weitere Details finden sich in meiner Thesis.

Die gesamte Infrastruktur lässt sich mit **Docker Compose** erzeugen und starten:

```
docker-compose -f docker-compose-dev.yml up --build
```

Der Flag `--build` ist nur für den initialen Build nötig.

Die Container lassen sich analog wieder stoppen und entfernen:

```
docker-compose -f docker-compose-dev.yml down
```

Um die Container nur zu stoppen, kann etwa

```
docker container stop <name>
```

genutzt werden.
Der Name des jeweiligen Containers kann etwa mit

```
docker container list
```

in Erfahrung gebracht werden.

### Nachträgliche Erweiterung um Python-Bibliotheken

Neue Bibliotheken können entweder kurzfristig mit dem Package-Manager **pip**
im bestehenden Container `backend` über die Docker-Shell installiert werden:

```
docker exec -it <container-id> sh
```

In diesem Fall sind die Bibliotheken nur verfügbar, solange dieser Container besteht.

Für eine dauerhafte Erweiterung kann zudem die Datei `backend/requirements.txt` entsprechend
modifiziert werden.
In diesem Fall ist allerdings zunächst ein erneuter Build (siehe Deployment) nötig.

---

Christian Klüh (christian.klueh@informatik.hs-fulda.de)

Betreuer: Prof. Dr. Alexander Gepperth.
Zweitprüferin: Prof. Dr. Yvonne Jung.

Hochschule Fulda, WiSe22/23.
