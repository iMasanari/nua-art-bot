const fetch = require('isomorphic-fetch')
const client = require('cheerio-httpcli')

const UserName = /** @type {string} */ (process.env.NUA_USER_NAME)
const Password = /** @type {string} */ (process.env.NUA_PASSWORD)

const url = 'https://www.nua.ac.jp/portal'

const tokenPromise = (async () => {
  const loginPage = await client.fetch(`${url}/Account/Login?ReturnUrl=%2Fportal%2F`)
  const loginRedirectPage = await loginPage.$('form').submit({ UserName, Password })

  const match = loginRedirectPage.body.match(/var _ClientTokenId = '(.+?)';/)

  const _ClientTokenId = match ? match[1] : ''
  const authorizePage = await client.fetch(`${url}/Account/Authorize?client_id=${_ClientTokenId}&response_type=token&state=`)

  return authorizePage.response.cookies.tokenAuth_access_token
})()

/** @param {string} file */
module.exports = async (file) => {
  const response = await fetch(`${url}/api/${file}`, {
    headers: { 'X-CPAuthorize': `Bearer ${await tokenPromise}` }
  })

  if (!response.ok) {
    throw `取得エラーが発生しました
url: ${response.url}
status: ${response.status}
statusText: ${response.statusText}
body: ${await response.text()}`
  }

  return response.json()
}
