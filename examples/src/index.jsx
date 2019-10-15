import React from 'react';
import * as ReactDOM from 'react-dom';
import UseForm from './UseForm';
import UseTree from './UseTree';

function main() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  ReactDOM.render(
    <>
      <UseTree />
    </>,
    container,
  );
}

main();

export default main;
