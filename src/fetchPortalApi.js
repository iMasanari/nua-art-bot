const fetch = require('node-fetch')
const bearer = process.env.NUA_BEARER
const url = 'https://www.nua.ac.jp/portal/api/'

module.exports = async (file) => {
  const response = await fetch(url + file, { headers: { 'X-CPAuthorize': 'Bearer ' + bearer } })

  if (!response.ok) {
    throw `取得エラーが発生しました
url: ${response.url}
status: ${response.status}
statusText: ${response.statusText}
body: ${await response.text()}`
  }

  return response.json()
}
