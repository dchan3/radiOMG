import React from 'react';

export default function LoginErrorMessage({ errorMessage }) {
  return <div style={{ backgroundColor: 'pink', color: 'red',
    border: 'thin red solid' }}>
    {errorMessage}
  </div>;
}
