import fs from 'fs';
import path from 'path';

const XML_PATH = 'build/public/insider-sw-sdk.js';

const insiderRendering = (req, res) => {
  fs.readFile(path.resolve(XML_PATH), 'utf8', (err, data) => {
    if (err) {
      res.status(500).end();
    } else {
      res.header('Content-Type', 'application/javascript');
      res.send(data);
    }
  });
};

export default insiderRendering;
