import React, { createRef } from 'react';

let $heading = createRef();

// function hasLoaded() {
//  $heading.current.focus();
// }

function Home() {
  return (
    <>
      <h1 ref={$heading} className="text-5xl font-semibold">
        Current weather
      </h1>
    </>
  );
}

export default Home;
