import { useState, useEffect, useRef } from 'react';

export default function useSubscribe(initialState, subscription) {
  let [state, setState] = useState(initialState),
    sub = useRef();

  useEffect(function() {
    sub.current = subscription(setState);

    return function cleanup() {
      if (sub.current) sub.current.stop();
    }
  }, [state]);

  return state;
}