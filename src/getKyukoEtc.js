const fetchPortalApi = require('./fetchPortalApi')

/** @typedef {{ tweet: string, replies: string[] }} TweetData */

/** @param {string} yyyy_mm_dd */
const formatDate = (yyyy_mm_dd) => {
  const [, month, date] = yyyy_mm_dd.split('-')
  return `${+month}/${+date}`
}

/** @param {string} yyyy_mm_dd */
const getKyuko = async (yyyy_mm_dd) => {
  /** @type {any[]} */
  const json = await fetchPortalApi('KyukoInfo')

  return json
    .filter((kyukoData) => !yyyy_mm_dd || kyukoData.kyukoDate === yyyy_mm_dd)
    .map((kyukoData) => {
      const date = formatDate(kyukoData.kyukoDate)
      const tweet = `${kyukoData.jigen}限【休講】${kyukoData.kogiNm}`
      const replies = [`@no_TL
【休講】
日時　${date}（${kyukoData.yobi}）
講時　${kyukoData.jigen}限
科目　${kyukoData.kogiNm}
担当　${kyukoData.kyoinNms}`
        + (kyukoData.biko ? `
備考　${kyukoData.biko}` : '')]

      return { tweet, replies, date }
    })
}

/** @param {string} yyyy_mm_dd */
const getHoko = async (yyyy_mm_dd) => {
  /** @type {any[]} */
  const json = await fetchPortalApi('HokoInfo')

  return json
    .filter((hokoData) => !yyyy_mm_dd || hokoData.hokoDate === yyyy_mm_dd)
    .map((hokoData) => {
      const date = formatDate(hokoData.hokoDate)
      const tweet = `${hokoData.hokoJigen}限【補講】${hokoData.hokoKogiNm}`

      const replies = [`@no_TL
【補講】
日時　${date}（${hokoData.hokoYobi}）
講時　${hokoData.hokoJigen}限
科目　${hokoData.hokoKogiNm}
担当　${hokoData.hokoKyoinNms}
教室　${hokoData.hokoKyoshitsuNms}`
        + (hokoData.hokoBiko ? `
備考　${hokoData.hokoBiko}` : '')]

      return { tweet, replies, date }
    })
}

/** @param {string} yyyy_mm_dd */
const getKyoshitsuChange = async (yyyy_mm_dd) => {
  /** @type {any[]} */
  const json = await fetchPortalApi('KyoshitsuChangeInfo')

  return json
    .filter((kcData) => !yyyy_mm_dd || kcData.kcDate === yyyy_mm_dd)
    .map((kcData) => {
      const date = formatDate(kcData.kcDate)
      const tweet = `${kcData.kcJigen}限【移動】${kcData.kcKogiNm}`

      const replies = [`@no_TL
【教室移動】
日時　${date}（${kcData.kcYobi}）
講時　${kcData.kcJigen}限
科目　${kcData.kcKogiNm}
担当　${kcData.kcKyoinNms}
変更前　${kcData.kyoshitsuNmsOld}
変更後　${kcData.kyoshitsuNmsNew}`
        + (kcData.kcBiko ? `
備考　${kcData.kcBiko}` : '')]

      return { tweet, replies, date }
    })
}

/** @param {string} yyyy_mm_dd */
module.exports = async (yyyy_mm_dd) => {
  const [kyuko, hoko, KyoshitsuChange] = await Promise.all([
    getKyuko(yyyy_mm_dd),
    getHoko(yyyy_mm_dd),
    getKyoshitsuChange(yyyy_mm_dd)
  ])

  return [...kyuko, ...hoko, ...KyoshitsuChange]
}
