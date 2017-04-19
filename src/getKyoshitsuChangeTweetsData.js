const fetchPortalApi = require('./fetchPortalApi')
const formatDate = require('./formatDate')

/** @return {Promise.<{ tweet: string, replies: string[], date: string }[]>} */
module.exports = async () => {
  const json = await fetchPortalApi('KyoshitsuChangeInfo')

  return json.map(data => {
    const date = formatDate(data.kcDate)
    const tweet = `【移動】${date} ${data.kcKogiNm}`

    const replies = [`@no_TL
【教室移動】
日時　${date}（${data.kcYobi}）
講時　${data.kcJigen}限
科目　${data.kcKogiNm}
担当　${data.kcKyoinNms}
変更前　${data.kyoshitsuNmsOld}
変更後　${data.kyoshitsuNmsNew}`
      + (data.kcBiko ? `
備考　${data.kcBiko}` : '')]

    return { tweet, replies, date }
  })
}
