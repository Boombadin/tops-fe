import { get } from 'lodash'

export const formatNumber = (number) => number ? new Intl.NumberFormat('th-TH').format(number) : 0
export const strToNum = (text) => text ? parseFloat(text.replace(new RegExp(',', 'g'), '')) : 0
export const generateCalculateNyb = (values, state) => {
  const totalAmount1 = strToNum(values.percent_1)
  const totalAmount2 = strToNum(values.percent_2)
  const basket = []
  if (totalAmount1 > 0) {
    basket.push({
      percent: 35,
      total: totalAmount1
    })
  }
  if (totalAmount2 > 0) {
    basket.push({
      percent: 17,
      total: totalAmount2
    })
  }
  const newValues = {
    calculation: {
      bank_issued: state.payment_methods === 'credit_card' ? get(values, 'bank_issued', '') : '',
      basket,
      ...state,
    }
  }
  return newValues
}
