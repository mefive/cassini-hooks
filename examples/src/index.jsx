import React from 'react';
import * as ReactDOM from 'react-dom';
import UserFormOuter from './UserFormOuter';

function main() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  ReactDOM.render(
    <>
      <UserFormOuter />
    </>,
    container,
  );
}

main();

export default main;
