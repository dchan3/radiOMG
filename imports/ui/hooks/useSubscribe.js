import { useState, useEffect, useRef } from 'react';

export default function useSubscribe(initialState, subscription, deps) {
  let [state, setState] = useState(initialState),
    sub = useRef();

  useEffect(function() {
    sub.current = subscription(setState);

    return function cleanup() {
      if (sub.current) sub.current.stop();
    }
  }, deps ? [state, ...deps] : [state]);

  return state;
}