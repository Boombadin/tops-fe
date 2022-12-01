import T1PService from '../services/t1pService'

const loginT1P = async (req, res) => {
  try {
    const baseUrl = process.env.URL_T1P
    const clientId = process.env.CLIENT_ID
    const redirectURI = process.env.REDIRECT_URI

    const url = `${baseUrl}&client_id=${clientId}&redirect_uri=${redirectURI}`
    return res.redirect(301, url)
  } catch (e) {
    return null
  }
}

const callback = async (req, res) => {
  try {
    const token = req.query.token
    
    if (token) {
      const fetchToken = await T1PService.getToken(token)
      const d = new Date()
      const year = d.getFullYear()
      const month = d.getMonth()
      const day = d.getDate()
      const c = new Date(year + 1, month, day)
      res.cookie('user_token', fetchToken, { expires: c })
      return res.redirect(301, '/callback/success')
    } 
    
    return res.redirect(301, '/callback/error')
  } catch (e) {
    return res.redirect(301, '/callback/error')
  }
}

export default {
  loginT1P,
  callback
}
