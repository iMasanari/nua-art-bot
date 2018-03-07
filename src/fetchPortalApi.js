const fetch = require('node-fetch').default
const client = require('cheerio-httpcli')

const UserName = /** @type {string} */ (process.env.NUA_USER_NAME)
const Password = /** @type {string} */ (process.env.NUA_PASSWORD)

const url = 'https://www.nua.ac.jp/portal'

/** @param {number} ms */
const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const getAccessToken = (() => {
  /** @type {Promise<string> | undefined} */
  let loginPromise

  const login = async () => {
    const loginPage = await client.fetch(`${url}/Account/Login?ReturnUrl=%2Fportal%2F`)
    await sleep(1000)

    const loginRedirectPage = await loginPage.$('form').submit({ UserName, Password })
    await sleep(1000)

    const match = loginRedirectPage.body.match(/var _ClientTokenId = '(.+?)';/)

    const _ClientTokenId = match ? match[1] : ''
    const authorizePage = await client.fetch(`${url}/Account/Authorize?client_id=${_ClientTokenId}&response_type=token&state=`)
    await sleep(1000)

    return authorizePage.response.cookies.tokenAuth_access_token
  }

  return async () => {
    if (!loginPromise) {
      loginPromise = login()
    }

    return await loginPromise
  }
})()

/** @param {string} file */
module.exports = async (file) => {
  const response = await fetch(`${url}/api/${file}`, {
    headers: { 'X-CPAuthorize': `Bearer ${await getAccessToken()}` }
  })

  await sleep(1000)

  if (!response.ok) {
    throw `取得エラーが発生しました
url: ${response.url}
status: ${response.status}
statusText: ${response.statusText}
body: ${await response.text()}`
  }

  return response.json()
}
