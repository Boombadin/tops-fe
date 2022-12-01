import { setModel } from '../../../utils/Model'

const set = (data) => {
  const { number } = setModel(data)
  return {
    giftVoucher: number('voucher'),
    discount: number('discount'),
    total: number('total_amount'),
  }
}

/** @return {Model} */
const get = (data) => data
const Model = set()

export const NYB = {
  set,
  get,
}
