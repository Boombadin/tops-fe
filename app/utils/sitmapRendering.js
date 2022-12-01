import fs from 'fs';
import path from 'path';

const XML_PATH = 'build/public/sitemap.xml';

const robotsRendering = (req, res) => {
  fs.readFile(path.resolve(XML_PATH), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.header('Content-Type', 'application/xml');
      res.send(data);
    }
  });
};

export default robotsRendering;
