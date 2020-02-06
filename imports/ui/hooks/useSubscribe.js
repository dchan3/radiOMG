import { useState, useEffect } from 'react';

export default function useSubscribe(initialState, subscription, deps) {
  let [state, setState] = useState(initialState),
    sub = null;

  useEffect(function() {
    sub = subscription(setState);

    return function cleanup() {
      if (sub) sub.stop();
      sub = null;
    }
  }, deps || []);

  return state;
}
