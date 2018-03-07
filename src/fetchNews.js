const fetchPortalApi = require('./fetchPortalApi')

/** @param {string} yyyy_mm_dd */
module.exports = async (yyyy_mm_dd) => {
  // TODO: 取得urlを変更し、来年度に対応させる
  /** @type {any[]} */
  const json = await fetchPortalApi('DeliveredNews/Nendo/2017')

  const promises = json
    .filter((newsData) => newsData.newsDate.startsWith(yyyy_mm_dd))
    .map(async (newsData) => {
      const deliveredNews = await fetchPortalApi(`DeliveredNews/${newsData.id}`)

      const title = `【${newsData.category}】${newsData.title}`
      const tweet = title.length > 20 ? title.substr(0, 20 - 1) + '…' : title

      const replies = [`@no_TL
【${newsData.category}】${newsData.title}
${deliveredNews.naiyo}`]

      return { tweet, replies }
    })

  return Promise.all(promises)
}