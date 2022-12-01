import { get } from 'lodash'

export const codeStatus = (code) => {
  switch (code) {
    case 200: return 'OK';
    case 201: return 'Created';
    case 202: return 'Accepted';
    case 204: return 'No Content';
    case 400: return 'Bad Request';
    case 401: return 'Unauthorized';
    case 403: return 'Forbidden';
    case 404: return 'Not Found';
    case 405: return 'Method Not Allowed';
    case 422: return 'Unprocessable Entity';
    case 500: return 'Internal Server Error';
    case 502: return 'Bad Gateway';
    case 503: return 'Service Unavailable';
    case 504: return 'Gateway Timeout';
    default: return 'Error';
  }
};

export const responseSuccess = (code, res, data) => res.status(code).json({ data, status: 'OK', code })
export const responseError = (res, error) => {
  const code = get(error, 'response.status', get(error, 'response.statusCode', 404))
  const errMsg = get(error, 'response.data.message', error.message)
  console.error(errMsg)
  return res.status(code).json({ error: error.message, status: codeStatus(code), code })
}
export const responseErrorValidation = (code, res, error) => {
  return res.status(code).json({ errors: mapErrorMsg(error), status: codeStatus(code), code })
}

// Error Validation
const mapErrorMsg = (err) => {
  const errorObj = {}
  const errors = get(err, 'details', [])
  errors.map((item => {
    const key = get(item, 'context.key', '')
    const msg = item.message
    errorObj[key] = msg
  }))
  return errorObj
}
