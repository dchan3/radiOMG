import React, { useState, useEffect, useRef, useContext } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import { $ } from 'meteor/jquery';
import { Session } from 'meteor/session';
import 'mediaelement';
import { scorpius } from 'meteor/scorpiusjs:core';
import PlayingContext from '../../contexts/PlayingContext';

export default function MediaElement({ options, id, src }) {
  let [, setState] = useState({ }), ref = useRef(),
    { playing, setPlaying, src: ctxSrc } = useContext(PlayingContext);

  function success(mediaElement) {
    $('.mejs__time-slider').css('visibility', 'hidden');

    $('.mejs__playpause-button').click(function () {
      setPlaying(!playing);

      if (Session.equals('defaultLoaded', true)) {
        var message = `Now playing the ${
          scorpius.dictionary.get('mainPage.title', 'station\'s')} live stream`;
        Session.set('defaultLoaded', false);

        if (!Session.get('playedStream')) {
          Bert.alert(message, 'default', 'growl-top-right', 'fa-music');
          Session.set('playedStream', true);
        }
      }
    });

    global.player = mediaElement;
  }

  function error() {
    console.error('Error initializing the media element.');
  }

  useEffect(function() {
    const { MediaElementPlayer } = global;

    if (!MediaElementPlayer) {
      return;
    }

    const newOptions = Object.assign({}, options, {
      // Read the Notes below for more explanation
      // about how to set up the path for shims
      pluginPath: '/mejs/',
      alwaysShowControls: true,
      features: ['playpause', 'progress'],
      iPadUseNativeControls: false,
      iPhoneUseNativeControls: false,
      AndroidUseNativeControls: false,
      success, error
    });

    setState({ player: new MediaElementPlayer(id, newOptions) });
  }, []);

  return <div className="audio-player">
    <audio id={id} ref={ref} controls>
      <source src={src} type="audio/mp3"></source>
    </audio>
    {(ctxSrc === 'http://stream.ktuh.org:8000/stream-mp3') ?
      <span className="mejs__broadcast">Live Broadcast</span> : null}
  </div>;
}
