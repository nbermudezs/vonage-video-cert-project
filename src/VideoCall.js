import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const YOUTUBE_VIDEO_ID = 'vD6XWXj9l8Q';
let player = null;

function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function VideoCall({ room, subscribeOnly }) {
  const [sessionCredentials, setSessionCredentials] = useState();
  const [session, setSession] = useState();
  const [publisher, setPublisher] = useState();

  function onPlayerReady(event) {
    player = event.target;
    if (subscribeOnly) {
      player.playVideo();
      return;
    }
    session.signal({
      type: 'youtubeVideoReady',
      data: YOUTUBE_VIDEO_ID
    });
    event.target.playVideo();
  }

  function onPlayerStateChange(e) {
    if (subscribeOnly) {
      return;
    }
    if (e.data == YT.PlayerState.PAUSED) {
      session.signal({
        type: 'youtubeVideoPaused',
        data: e.target.getCurrentTime()
      });
    }
    if (e.data == YT.PlayerState.PLAYING) {
      session.signal({
        type: 'youtubeVideoResumed',
        data: e.target.getCurrentTime()
      });
    }
  }

  useEffect(() => {
    axios.get(`/api/rtc/new-session?room=${room}`).then(({ data }) => {
      setSessionCredentials(data);
    });

    setPublisher(
      OT.initPublisher(
        'publisher',
        {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        },
        handleError
      )
    );
  }, []);

  useEffect(() => {
    if (!sessionCredentials) {
      return;
    }
    const { apiKey, sessionId, token } = sessionCredentials;
    const newSession = OT.initSession(apiKey, sessionId);
    newSession.connect(token, (err) => {
      if (err) {
        console.log(err.message);
      } else {
        newSession.publish(publisher, handleError);
        setSession(newSession);
      }
    });

    newSession.on('streamCreated', function (event) {
      newSession.subscribe(
        event.stream,
        'subscriber',
        {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        },
        handleError
      );
    });

    newSession.on('signal:youtubeVideoReady', (event) => {
      if (
        newSession.connection &&
        event.from.connectionId != newSession.connection.id
      ) {
        // Signal received from another client
        initPlayer();
      }
    });

    newSession.on('signal:youtubeVideoPaused', (event) => {
      if (
        newSession.connection &&
        event.from.connectionId != newSession.connection.id
      ) {
        // Signal received from another client
        player.seekTo(event.data);
        player.pauseVideo();
      }
    });

    newSession.on('signal:youtubeVideoResumed', (event) => {
      if (
        newSession.connection &&
        event.from.connectionId != newSession.connection.id
      ) {
        // Signal received from another client
        player.seekTo(event.data);
        player.playVideo();
      }
    });
  }, [sessionCredentials]);

  function initPlayer() {
    const p = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: YOUTUBE_VIDEO_ID,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }

  return (
    <>
      {subscribeOnly ? (
        <div className="overlay">
          <div id="player"></div>
        </div>
      ) : (
        <div id="player"></div>
      )}
      <div id="videos">
        <div id="subscriber"></div>
        <div id="publisher"></div>
        {!subscribeOnly && (
          <button className="btn" type="button" onClick={initPlayer}>
            Share youtube video
          </button>
        )}
      </div>
    </>
  );
}

export default VideoCall;
