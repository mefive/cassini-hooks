import React from 'react';
import * as ReactDOM from 'react-dom';
import UseForm from './UseForm';

function main() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  ReactDOM.render(
    <>
      <UseForm />
    </>,
    container,
  );
}

main();

export default main;
