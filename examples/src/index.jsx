import React from 'react';
import * as ReactDOM from 'react-dom';
import UserForm from './UserForm';

function main() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  ReactDOM.render(
    <>
      <UserForm />
    </>,
    container,
  );
}

main();

export default main;
