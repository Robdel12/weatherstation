# Weather-station [![This project is using Percy.io for visual regression
testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/robdel12/weather-station) [![CircleCI](https://circleci.com/gh/Robdel12/weatherstation/tree/master.svg?style=svg)](https://circleci.com/gh/Robdel12/weatherstation/tree/master)

This is my project weather station built with a Particle Photon and
Sparkfun weather shield (and meters). That `POST`s data a Node /
Express / MongoDB server. That server also will be the API which the
(eventual) React PWA will query for data.

## Getting started

First thing you need to do is flash your Photon with the firmware
that's inside of `firmware/weatherstation.ino`.

After the Photon is flashed, you should deploy this server to where
ever you want or expose your local server via ngrok.

Once you do that, you need to setup a webhook in the Particle
interface that posts to where the server lives. Set the Webhook
settings to:

- Event Name: `weather`
- URL to be `[YOUR_SERVER_URL]/v1/collect`.
- Request Type: `POST`
- Request Format: `JSON`
- Device: Whatever you want

![Webhook screenshot example](/docs/images/webhook.png)

Now go to `[YOUR_SERVER_URL]/temp` with the Photon connected to power
to see if data is being collected properly.

### TODO

Document how to setup server, run client, etc. Very much WIP right
now. Check the `package.json` scripts for hints
