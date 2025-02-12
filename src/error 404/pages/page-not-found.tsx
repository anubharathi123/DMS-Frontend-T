import { Helmet } from 'react-helmet-async';
import React from 'react';
import { CONFIG } from 'error 404/config-global';

import NotFoundView from 'error 404/sections/error/not-found-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`404 page not found! | Error - ${CONFIG.appName}`}</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
