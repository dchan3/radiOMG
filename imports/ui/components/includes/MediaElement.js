import React, { useState, useEffect, useRef } from 'react';
import { Bert } from 'meteor/themeteorchef:bert';
import { $ } from 'meteor/jquery';
import { Session } from 'meteor/session';
import 'mediaelement';
import { scorpius } from 'meteor/scorpiusjs:core';
import usePlayingContext from '../../hooks/usePlayingContext';

export default function MediaElement({ options, id, src }) {
  let [, setState] = useState({ }), ref = useRef(),
    { playing, setPlaying } = usePlayingContext();

  function success(mediaElement) {
    $('.mejs__time-rail').append(
      '<span class="mejs__broadcast">Live Broadcast</span>');

    $('.mejs__time-slider').css('visibility', 'hidden');

    $('.mejs__playpause-button').click(function () {
      if (!playing) setPlaying(true);
      else if (playing) setPlaying(false);
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

    mediaElement.addEventListener('playing', function() {
      setPlaying(true);
    });

    mediaElement.addEventListener('pause', function() {
      setPlaying(false);
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

    $('.mejs__time-rail').append(
      '<span class="mejs__broadcast">Live Broadcast</span>');
  }, []);

  useEffect(function() {
    if (global.player.getSrc() === 'http://stream.ktuh.org:8000/stream-mp3') {
      $('.mejs__time-slider').css('visibility', 'hidden');
      $('.mejs__time-rail').append(
        '<span class="mejs__broadcast">Live Broadcast</span>');
    }
    else $('.mejs__time-slider').css('visibility', 'visible');
  }, [global.player && global.player.getSrc()]);

  return <div className="audio-player">
    <audio id={id} ref={ref} controls>
      <source src={src} type="audio/mp3"></source>
    </audio>
  </div>;
}
