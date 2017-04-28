/* @flow */
const fetchPortalApi = require('./fetchPortalApi')

const formatDate = (yyyy_mm_dd) => {
  const [, month, date] = yyyy_mm_dd.split('-')
  return `${+month}/${+date}`
}

const getKyuko = async (YYYY_MM_DD/*: ?string */) => {
  const json/*: any[] */ = await fetchPortalApi('KyukoInfo')

  return json
    .filter((kyukoData) => !YYYY_MM_DD || kyukoData.kyukoDate === YYYY_MM_DD)
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

const getHoko = async (YYYY_MM_DD/*: ?string */) => {
  const json/*: any[] */ = await fetchPortalApi('HokoInfo')

  return json
    .filter((hokoData) => !YYYY_MM_DD || hokoData.hokoDate === YYYY_MM_DD)
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

const getKyoshitsuChange = async (YYYY_MM_DD/*: ?string */) => {
  const json/*: any[] */ = await fetchPortalApi('KyoshitsuChangeInfo')

  return json
    .filter((kcData) => !YYYY_MM_DD || kcData.kcDate === YYYY_MM_DD)
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

module.exports = async (YYYY_MM_DD/*: ?string */) => {
  const kyukoEtc = await Promise.all([
    getKyuko(YYYY_MM_DD),
    getHoko(YYYY_MM_DD),
    getKyoshitsuChange(YYYY_MM_DD)
  ])

  return [].concat(...kyukoEtc)
}
