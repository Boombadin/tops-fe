// import Joi from 'joi'
import NybService from '../services/nybService'
import { responseSuccess, responseError, responseErrorValidation } from '../utils/codeStatus';

const calculate = (req, res) => {
  const store = req.headers['x-store-code'] || ''
  // // Data Validation
  // const data = req.body
  // // define the validation schema
  // const schema = Joi.object().keys({
  //   calculation: Joi.object().keys({
  //     payment_methods: Joi.string().valid(['cash', 'credit_card']).required(),
  //     bank_issued: Joi.string().valid(['', 't1', 'other']),
  //     discount_type: Joi.string().valid(['on_top', 'voucher']).required(),
  //     basket: Joi.array().required()
  //   })
  // })
  // // validate the request data against the schema
  // Joi.validate(data, schema, (err) => {
  //   if (err) {
  //     responseErrorValidation(400, res, err)
  //   } else {
  //     NybService.calculate(store, req.body)
  //       .then((response) => {
  //         responseSuccess(200, res, response.data)
  //       })
  //       .catch((error) => {
  //         responseError(res, error)
  //       })
  //   }
  // });

  NybService.calculate(store, req.body)
    .then((response) => {
      responseSuccess(200, res, response.data)
    })
    .catch((error) => {
      responseError(res, error)
    })
}

const calculateStep1 = async (req, res) => {
  const store = req.headers['x-store-code'] || ''
  const userToken = req.cookies.user_token;
  const { discountType } = req.params
  // // Data Validation
  // const data = req.params
  // // define the validation schema
  // const schema = Joi.object().keys({
  //   discountType: Joi.string().valid(['ontop', 'voucher']).required(),
  // });
  // // validate the request data against the schema
  // Joi.validate(data, schema, (err) => {
  //   if (err) {
  //     responseErrorValidation(400, res, err)
  //   } else {
  //     NybService.calculateStep1(store, discountType)
  //       .then((response) => {
  //         responseSuccess(200, res, response.data)
  //       })
  //       .catch(error => {
  //         responseError(res, error)
  //       })
  //   }
  // });

  NybService.calculateStep1(userToken, store, discountType)
    .then((response) => {
      responseSuccess(200, res, response.data)
    })
    .catch(error => {
      responseError(res, error)
    })
}

const calculateStep2 = async (req, res) => {
  const store = req.headers['x-store-code'] || ''
  const userToken = req.cookies.user_token;
  const { issue } = req.params
  // // Data Validation
  // const data = req.params
  // // define the validation schema
  // const schema = Joi.object().keys({
  //   issue: Joi.string().valid(['t1', 'other']).required(),
  // });
  // // validate the request data against the schema
  // Joi.validate(data, schema, (err) => {
  //   if (err) {
  //     responseErrorValidation(400, res, err)
  //   } else {
  //     NybService.calculateStep1(store, issue)
  //       .then((response) => {
  //         responseSuccess(200, res, response.data)
  //       })
  //       .catch(error => {
  //         responseError(res, error)
  //       })
  //   }
  // });

  NybService.calculateStep2(userToken, store, issue)
    .then((response) => {
      responseSuccess(200, res, response.data)
    })
    .catch(error => {
      responseError(res, error)
    })
}

const selectDiscoutType = async (req, res) => {
  const store = req.headers['x-store-code'] || ''
  const userToken = req.cookies.user_token;

  NybService.selectDiscoutType(store, userToken)
    .then((response) => {
      responseSuccess(200, res, response.data)
    })
    .catch(error => {
      responseError(res, error)
    })
}

export default { 
  calculate,
  calculateStep1,
  calculateStep2,
  selectDiscoutType
};
