const fetchPortalApi = require('./fetchPortalApi')

/** @typedef {{ type: string, tweet: string, replies: string[], date: string }} TweetData */

/** @param {string} yyyy_mm_dd */
const formatDate = (yyyy_mm_dd) => {
  const [, month, date] = yyyy_mm_dd.split('-')
  return `${+month}/${+date}`
}

/** @return {Promise.<TweetData[]>} */
const getKyuko = async () => {
  const json = await fetchPortalApi('KyukoInfo')

  return json.map((data) => {
    const date = formatDate(data.kyukoDate)
    const tweet = `${data.jigen}限【休講】${data.kogiNm}`
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

/** @return {Promise.<TweetData[]>} */
const getHoko = async () => {
  const json = await fetchPortalApi('HokoInfo')

  return json.map((data) => {
    const date = formatDate(data.hokoDate)
    const tweet = `${data.hokoJigen}限【補講】${data.hokoKogiNm}`

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

/** @return {Promise.<TweetData[]>} */
const getKyoshitsuChange = async () => {
  const json = await fetchPortalApi('KyoshitsuChangeInfo')

  return json.map((data) => {
    const date = formatDate(data.kcDate)
    const tweet = `${data.kcJigen}限【移動】${data.kcKogiNm}`

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

module.exports = async () => {
  const [kyuko, hoko, kyoshitsuChange] = await Promise.all([
    getKyuko(),
    getHoko(),
    getKyoshitsuChange()
  ])

  return [...kyuko, ...hoko, ...kyoshitsuChange]
}
