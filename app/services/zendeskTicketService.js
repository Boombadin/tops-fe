import axios from 'axios'

const post = ({ data, url, token }) =>
  new Promise((resolve, reject) => {
    const params = {
      url: `${url}/api/v2/tickets.json`,
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`
      },
      data
    }

    axios(params)
      .then(response => {
        const resp = response.data
        resolve(resp)
      })
      .catch(e => {
        reject(e)
      })
  })

export default { post };
