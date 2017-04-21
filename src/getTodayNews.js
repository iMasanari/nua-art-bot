const fetchPortalApi = require('./fetchPortalApi')

/** @typedef {{ type: string, tweet: string, replies: string[] }} TweetData */

/** @param {string} yyyy_mm_dd */
const formatDate = (yyyy_mm_dd) => {
  const [, month, date] = yyyy_mm_dd.split('-')
  return `${+month}/${+date}`
}

module.exports = async () => {
  // TODO: 取得urlを変更し、来年度に対応させる
  const json = await fetchPortalApi('DeliveredNews/Nendo/2017')

  const now = new Date()
  const today = `${now.getMonth() + 1}/${now.getDate()}`

  const promises = json.filter((data) =>
    formatDate(data.newsDate) === today
  ).map(async (data) => {
    const deliveredNews = await fetchPortalApi(`DeliveredNews/${data.id}`)

    const title = `【${data.category}】${data.title}`
    const tweet = title.length > 20 ? title.substr(0, 20 - 1) + '…' : title

    const replies = [`@no_TL
【${data.category}】${data.title}
${deliveredNews.naiyo}`]

    return { tweet, replies }
  })

  return Promise.all(promises)
}