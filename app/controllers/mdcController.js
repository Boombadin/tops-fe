import { get, find, isEmpty } from 'lodash';
import { privateDecrypt, constants } from 'crypto';
import awsParamStore from 'aws-param-store';
import config from '../config';

const decryptToken = async (req, res) => {
  const { aws_param_store } = config;

  if (isEmpty(aws_param_store)) {
    return res.send({ error: 'aws_param_store not setting.' });
  }

  const awsParam = await awsParamStore
    .getParametersByPath(aws_param_store, { region: 'ap-southeast-1' })
    .then(parameters => {
      return parameters;
    })
    .catch(error => {
      return error;
    });

  try {
    const redirectUrl = process.env.BASE_URL;
    const awsData = find(awsParam, val => val.Name === `${aws_param_store}key`);
    const privateKey = get(awsData, 'Value', '').toString('utf8');

    const { token } = req.query;
    const buffer = Buffer.from(token.replace(/ /g, '+'), 'base64');

    const decrypted = privateDecrypt(
      {
        key: privateKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      buffer,
    ).toString('ascii');

    res.cookie('user_token', decrypted, { maxAge: 1800000 });
    return res.redirect(301, redirectUrl);
  } catch (e) {
    return res.send({ error: e.message });
  }
};

export default { decryptToken };
