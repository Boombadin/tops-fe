import fs from 'fs';
import path from 'path';

export const TEMPLATE = {
  DEFAULT: path.resolve('build', 'public', 'bundle', 'index.html'),
  CREDIT_CARD_FRAME: path.resolve(
    'build',
    'public',
    'bundle',
    'creditCardFrame.html',
  ),
};

export const getHtmlTemplate = (template = TEMPLATE.DEFAULT) => {
  return new Promise((resolve, reject) => {
    fs.readFile(template, 'utf8', (err, data) => {
      if (err) return reject('index.html file not found');

      resolve(data);
    });
  });
};
