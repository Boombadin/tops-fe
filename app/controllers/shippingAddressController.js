import appConfig from '../config'

const setCurrentShippingAddress = (req, res) => {
  const { regionId, districtId, subdistrictId, zipcode, customerId } = req.body
  
  if (!regionId) return res.status(400).json({ status: 'error', message: 'regionId is required.' })
  if (!districtId) return res.status(400).json({ status: 'error', message: 'districtId is required.' })
  if (!subdistrictId) return res.status(400).json({ status: 'error', message: 'subdistrictId is required.' })
  if (!zipcode) return res.status(400).json({ status: 'error', message: 'zipcode is required.' })
  
  const addressCokieString = `${regionId},${districtId},${subdistrictId},${zipcode}`
  res.cookie(appConfig.shipping_address_cookie_name, addressCokieString)

  if (customerId) {
    res.cookie(`${appConfig.shipping_address_cookie_name}_${customerId}`, addressCokieString)
  }
  // res.cookie(appConfig.shipping_address_cookie_name, addressCokieString, { signed: true })
  return res.json({ status: 'success' })
}

export default {
  setCurrentShippingAddress
}
