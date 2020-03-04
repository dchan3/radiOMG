import React, { useState, createContext, useEffect } from 'react';

const PlayingContext = createContext({});

export default PlayingContext;

const { Provider } = PlayingContext;
export const PlayingProvider = ({ children, value }) => {
  let [playing, setPlaying] = useState(value && value.playing || false),
    [src, setSrc] = useState(value && value.src ||
      'http://stream.ktuh.org:8000/stream-mp3')

  useEffect(function() {
    if (global.player) {
      if (playing) global.player.play();
      else global.player.pause();
    }
  }, [playing]);

  useEffect(function() {
    if (global.player) {
      global.player.setSrc(src);
      global.player.play();
      setPlaying(true);
    }
  }, [src]);

  useEffect(function() {
    if (src !== 'http://stream.ktuh.org:8000/stream-mp3') {
      $('.mejs__time-slider').css('visibility', 'visible');
    }
    else {
      $('.mejs__time-slider').css('visibility', 'hidden');
    }
  }, [src]);

  return <Provider value={{
    playing, setPlaying, src, setSrc
  }}>{children}</Provider>;
};
