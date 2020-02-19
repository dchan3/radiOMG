import React, { useState, createContext } from 'react';

const PlayingContext = createContext({});

export default PlayingContext;

const { Provider } = PlayingContext;
export const PlayingProvider = ({ children }) => {
  let [playing, setPlaying] = useState(false);

  return <Provider value={{ playing, setPlaying }}>{children}</Provider>;
};
