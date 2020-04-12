# Weather-station
[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/robdel12/weather-station)
[![CircleCI](https://circleci.com/gh/Robdel12/weatherstation/tree/master.svg?style=svg)](https://circleci.com/gh/Robdel12/weatherstation/tree/master)

This is my project weather station built with a Particle Photon and Sparkfun
weather shield (and meters). That `POST`s data a Node / Express / MongoDB
server. That server also will be the API which the React PWA will query for
data.

## Getting started

First thing you need to do is flash your Photon with the firmware that's inside
of `firmware/weatherstation.ino`. Be sure to update [this
line](https://github.com/Robdel12/weatherstation/tree/master/firmware/weatherstation.ino#L177)
with your own server's hostname.

After the Photon is flashed, you should deploy this server to where ever you
want or expose your local server via ngrok.

Now go to `[YOUR_SERVER_URL]/weather` with the Photon connected to power to see
if data is being collected properly.

### TODO

Document how to setup server, run client, etc. Very much WIP right
now. Check the `package.json` scripts for hints
