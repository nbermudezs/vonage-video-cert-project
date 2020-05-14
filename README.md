## Showcase of Vonage Video API

This is a demo project to showcase the usage of Vonage Video API and also the OpenTok signaling feature. 
In this project you will be able to start a 1-1 call with another person and one of them will also be able to share a
youtube video and control without having to screenshare.

### Setup

1. Clone this repo `git clone https://github.com/nbermudezs/vonage-video-cert-project`
2. Install dependencies: `yarn`
3. Copy environment settings: `cp .env.example .env`
4. Set the values for the environment variables.
5. Run the server: `yarn dev`

### Using the app

1. You can give your 1-1 call a `room` name by passing a `room` param in the URL:
For example, `http://localhost:3000/?room=potato`
2. User A will access the meeting with `http://localhost:3000/?room=potato` and User B will do it with
`http://localhost:3000/?room=potato&subscribeOnly=true`. 
-  this is just a hacky way to tell the app who will be presenting the YouTube video.
3. from User A click on the 'Share youtube video' button
4. see that the video is also shown on User B and that when User A pauses the video it also pauses for User B.


