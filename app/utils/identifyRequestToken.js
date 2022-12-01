import uuid from 'uuid/v4';

export default function identifyRequestToken(req, res, next) {
  let requestIdToken = req.cookies['requestId'] || null;

  if (!requestIdToken) {
    requestIdToken = uuid();
    res.cookie('requestId', requestIdToken);
  }
  req.requestId = requestIdToken;
  res.set('requestId', requestIdToken);
  next();
}
