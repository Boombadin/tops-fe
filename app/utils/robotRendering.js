import fs from 'fs';
import path from 'path';

const allowRobot = process.env.ALLOW_ROBOT;
const ROBOTS_TEMPLATE_PATH =
  allowRobot === 'true'
    ? 'build/public/robots.allow.template'
    : 'build/public/robots.template';
const DOMAIN_NAME = process.env.BASE_URL;

const robotsRendering = (req, res) => {
  fs.readFile(path.resolve(ROBOTS_TEMPLATE_PATH), 'utf8', (err, data) => {
    if (err) {
      res.status(500).end();
    } else {
      const robots = data.replace(/{domain}/g, DOMAIN_NAME);
      res.header('Content-Type', 'text/plain');
      res.send(robots);
    }
  });
};

export default robotsRendering;
