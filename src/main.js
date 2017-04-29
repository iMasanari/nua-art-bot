const moment = require('moment')
const postTweet = require('./postTweet')
const getKyukoEtc = require('./getKyukoEtc')
const getNews = require('./getNews')

/** @typedef {{ tweet: string, replies: string[] }} TweetData */

/**
 * checkJsに型キャストがないっぽい?ので
 * 関数を使ってTweetDataの空の配列を取得する
 * @type {function():TweetData[]}
 */
const getEnptyTweetDataArray = () => []

/** @param {TweetData[]} tweets */
const reduceTweets = (tweets, tweetHeader = '') =>
  tweets.reduce((newTweets, tweetData) => {
    let last = newTweets[newTweets.length - 1]

    if (!last || last.tweet.length + tweetData.tweet.length > 140) {
      last = {
        tweet: tweetHeader,
        replies: [],
      }
      newTweets.push(last)
    }

    last.tweet += '\n' + tweetData.tweet
    last.replies.push(...tweetData.replies)

    return newTweets
  }, getEnptyTweetDataArray())

/** @param {TweetData[]} tweets */
const postTweetsAndSelfReplies = async (tweets) => {
  for (const { tweet, replies } of tweets) {
    const res = await postTweet(tweet)

    let replyId = res.id_str

    for (const reply of replies) {
      const res = await postTweet(reply, replyId)

      replyId = res.id_str
    }
  }
}

const main = async () => {
  // 明日の休講情報等を取得し、ツイートする
  const tommorow = moment().add(1, 'days').format('YYYY-MM-DD')
  /** @type {TweetData[]} */
  const kyukoEtc = await getKyukoEtc(tommorow)

  if (kyukoEtc.length === 0) {
    kyukoEtc.push({ tweet: '現在、休講等の情報は確認されていません', replies: [] })
  }
  else {
    kyukoEtc.sort((a, b) => a.tweet > b.tweet ? 1 : -1)
  }

  const tommorowShort = moment().add(1, 'days').format('M月D日')
  await postTweetsAndSelfReplies(reduceTweets(kyukoEtc, `明日（${tommorowShort}）`))

  // 今日の新着お知らせを取得し、ツイートする
  const today = moment().format('YYYY-MM-DD')
  const newsData = await getNews(today)

  await postTweetsAndSelfReplies(reduceTweets(newsData, 'お知らせ'))
}

module.exports = main
