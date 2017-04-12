const fetch = require('node-fetch')
const bearer = require('../token.json').nua.bearer

const url = 'https://www.nua.ac.jp/portal/api/KyukoInfo'

/** @param {string} yyyy_mm_dd */
const formatDate = (yyyy_mm_dd) => {
  const [, month, date] = yyyy_mm_dd.split('-')
  return `${+month}/${+date}`
}

/** @return {Promise.<(TweetData | { date: string })[]>} */
const getTweetsData = async () => {
  const response = await fetch(url, { headers: { 'X-CPAuthorize': 'Bearer ' + bearer } })

  if (!response.ok) {
    throw `取得エラーが発生しました
url: ${response.url}
status: ${response.status}
statusText: ${response.statusText}
body: ${await response.text()}`
  }

  const json = await response.json()

  return json.map(data => {
    const date = formatDate(data.kyukoDate)
    const tweet = `【休講】${date} ${data.kogiNm}`
    const replies = [`@no_TL
日時　${date}（${data.yobi}）
講時　${data.jigen}限
科目　${data.kogiNm}
担当　${data.kyoinNms}`
      + (data.biko ? `
備考　${data.biko}` : '')]

    return { tweet, replies, date }
  })
}

module.exports = getTweetsData
