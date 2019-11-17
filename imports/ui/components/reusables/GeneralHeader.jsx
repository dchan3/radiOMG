import React from 'react';

export default function GeneralHeader({ big, children }) {
  if (big) {
    return <h1 className="general__header">{children}</h1>;
  }
  else {
    return <h2 className="general__header">{children}</h2>;
  }
}

GeneralHeader.defaultProps = {
  big: false
};
