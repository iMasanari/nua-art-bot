const fetchPortalApi = require('./fetchPortalApi')
const formatDate = require('./formatDate')

/** @return {Promise.<{ tweet: string, replies: string[], date: string }[]>} */
module.exports = async () => {
  const json = await fetchPortalApi('HokoInfo')

  return json.map(data => {
    const date = formatDate(data.hokoDate)
    const tweet = `【補講】${date} ${data.hokoKogiNm}`

    const replies = [`@no_TL
【補講】
日時　${date}（${data.hokoYobi}）
講時　${data.hokoJigen}限
科目　${data.hokoKogiNm}
担当　${data.hokoKyoinNms}
教室　${data.hokoKyoshitsuNms}`
      + (data.hokoBiko ? `
備考　${data.hokoBiko}` : '')]

    return { tweet, replies, date }
  })
}
