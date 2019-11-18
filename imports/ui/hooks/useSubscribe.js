import { useState, useEffect } from 'react';

export default function useSubscribe(initialState, subscription, deps) {
  let [state, setState] = useState(initialState),
    sub = null;

  let [ready, setReady] = useState(false);

  useEffect(function() {
    sub = subscription(setState);

    if (sub && sub.ready()) setReady(true);

    return function cleanup() {
      if (sub) sub.stop();
      sub = null;
    }
  }, deps ? [state, ...deps, ready] : [state, ready]);

  return state;
}
