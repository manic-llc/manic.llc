import { config } from 'dotenv';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import * as url from 'url';
import fallback from 'express-history-api-fallback';
import fs from 'fs';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const key = fs.readFileSync(path.join(__dirname, './ssl/private.key.pem'))
const cert = fs.readFileSync(path.join(__dirname, './ssl/domain.cert.pem'))

config();

const root = path.resolve(__dirname, '../dist');
const app = express({
  key,
  cert
});

app.use(compression());
app.use(morgan('combined'));
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(root));
  app.use(fallback('index.html', { root }));
}

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`manic.llc is now listening on port ${port}.`);
});