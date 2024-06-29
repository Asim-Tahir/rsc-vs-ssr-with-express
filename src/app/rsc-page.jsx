import React, { Suspense } from 'react';

import Albums from './components/Albums.jsx';

export default async function RSCPage() {
  return (
    <>
      <h1 className="text-3xl mb-3">Albums:</h1>
      <Suspense fallback="Getting albums...">
        {/* @ts-expect-error 'Promise<Element>' is not a valid JSX element. */}
        <Albums />
      </Suspense>
    </>
  );
}
