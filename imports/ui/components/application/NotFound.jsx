import React, { Component } from 'react';

export default class NotFound extends Component {
  render() {
    return (
      <div className="not-found page jumbotron">
        <h2>404</h2>
        <p>{'Sorry, we couldn\'t find a page at this address.'}</p>
      </div>
    );
  }
}
