/* @flow */
const fetch = require('node-fetch')
const client = require('cheerio-httpcli')

const UserName = process.env.NUA_USER_NAME
const Password = process.env.NUA_PASSWORD

const url = 'https://www.nua.ac.jp/portal'

const tokenPromise = (async () => {
  const loginPage = await client.fetch(`${url}/Account/Login?ReturnUrl=%2Fportal%2F`)
  const loginRedirectPage = await loginPage.$('form').submit({ UserName, Password })

  const _ClientTokenId = loginRedirectPage.body.match(/var _ClientTokenId = '(.+?)';/)[1]
  const authorizePage = await client.fetch(`${url}/Account/Authorize?client_id=${_ClientTokenId}&response_type=token&state=`)

  return authorizePage.response.cookies.tokenAuth_access_token
})()

module.exports = async (file /*: string */)/*: Promise<any> */ => {
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
