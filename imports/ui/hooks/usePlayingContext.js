import { useContext } from 'react';
import PlayingContext from '../contexts/PlayingContext';

export default function usePlayingContext() {
  return useContext(PlayingContext);
}
