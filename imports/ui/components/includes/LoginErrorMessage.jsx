import React from 'react';
import { string } from 'prop-types';

export default function LoginErrorMessage({ errorMessage }) {
  return <div style={{ backgroundColor: 'pink', color: 'red',
    border: 'thin red solid' }}>
    {errorMessage}
  </div>;
}

LoginErrorMessage.propTypes = {
  errorMessage: string
};
