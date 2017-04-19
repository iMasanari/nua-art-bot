const fetchPortalApi = require('./fetchPortalApi')
const formatDate = require('./formatDate')

/** @return {Promise.<{ tweet: string, replies: string[], date: string }[]>} */
module.exports = async () => {
  const json = await fetchPortalApi('KyukoInfo')

  return json.map(data => {
    const date = formatDate(data.kyukoDate)
    const tweet = `【休講】${date} ${data.kogiNm}`
    const replies = [`@no_TL
【休講】
日時　${date}（${data.yobi}）
講時　${data.jigen}限
科目　${data.kogiNm}
担当　${data.kyoinNms}`
      + (data.biko ? `
備考　${data.biko}` : '')]

    return { tweet, replies, date }
  })
}
