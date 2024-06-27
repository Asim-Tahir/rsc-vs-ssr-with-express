import express from 'express';
import { createElement } from 'react';
import { renderToReadableStream } from 'react-server-dom-webpack/server.browser';
import { renderToString } from 'react-dom/server';
import pico from 'picocolors';
import { consola } from 'consola';

import clientManifest from '#build/client/client.manifest.json' with { type: 'json' };

const app = express();

app.use('/build', express.static('build'));

app.get('/', async (req, res) => {
  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSC with Streams</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="rsc"></div>
    <script type="module" src="/build/client/rsc.js"></script>
</body>
</html>`);
});

/**
 * Endpoint to render your server component to a stream.
 * This uses `react-server-dom-webpack` to parse React elements
 * into encoded virtual DOM elements for the client to read.
 */
app.get('/rsc', async (req, res) => {
  // Note This will raise a type error until you build with `npm run build:dev`
  const RSCPageImport = await import('../../build/app/rsc-page.js');

  // @ts-expect-error `Type '() => Promise<any>' is not assignable to type 'FunctionComponent<{}>'`
  const RSCPage = createElement(RSCPageImport.default);

  const stream = renderToReadableStream(RSCPage, clientManifest);

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Transfer-Encoding', 'chunked');

  stream.pipeTo(
    new WritableStream({
      write(chunk) {
        res.write(chunk);
      },
      close() {
        res.end();
      }
    })
  );
});

/**
 * Endpoint to render your html as a stream.
 */
app.get('/ssr', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  // Note This will raise a type error until you build with `npm run build:dev`
  const SSRPageImport = await import('../../build/app/ssr-page.js');

  const SSRPage = createElement(SSRPageImport.default);

  const ssrPageHTML = renderToString(SSRPage);

  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SSR</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    ${ssrPageHTML}
    <script type="module" src="/build/client/ssr.js"></script>
</body>
</html>`);
});

const PORT = 4000;

app
  .listen(PORT, async () => {
    // await build();

    consola.success(
      `Server is running on ${pico.dim(`http://localhost:${PORT}`)}`
    );
  })
  .on('error', (error) => {
    // @ts-expect-error `Property 'syscall' does not exist on type 'Error'`
    if (error.syscall !== 'listen') {
      throw error;
    }
    const isPipe = (portOrPipe) => Number.isNaN(portOrPipe);
    const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
    // @ts-expect-error `Property 'code' does not exist on type 'Error'`
    switch (error.code) {
      case 'EACCES':
        consola.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        consola.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        consola.error(error);
      // throw error;
    }
  });
