const moment = require('moment')
const postTweet = require('./postTweet')
const fetchKyukoEtc = require('./fetchKyukoEtc')
const fetchNews = require('./fetchNews')

/** @typedef {{ tweet: string, replies: string[] }} TweetData */

/**
 * checkJsに型キャストがないっぽい?ので
 * 関数を使ってTweetDataの空の配列を取得する
 * @return {TweetData[]}
 */
const getEnptyTweetDataArray = () => []

/** @param {TweetData[]} tweets */
const reduceTweets = (tweets, tweetHeader = '') =>
  tweets.reduce((newTweets, tweetData) => {
    let currentTweet = newTweets[newTweets.length - 1]

    // 1ツイート目、または140文字を超える場合は新しいツイートを作成する
    // +1しているのは改行文字のぶん
    if (!currentTweet || currentTweet.tweet.length + tweetData.tweet.length + 1 > 140) {
      currentTweet = {
        tweet: tweetHeader,
        replies: [],
      }
      newTweets.push(currentTweet)
    }

    currentTweet.tweet += '\n' + tweetData.tweet
    currentTweet.replies.push(...tweetData.replies)

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

const tweetTommorowKyukoEtc = async () => {
  const tommorowMoment = moment().add(1, 'days')
  const tommorow = tommorowMoment.format('YYYY-MM-DD')
  const tommorowShort = tommorowMoment.format('M月D日')

  /** @type {TweetData[]} */
  const kyukoEtc = await fetchKyukoEtc(tommorow)

  if (kyukoEtc.length === 0) {
    kyukoEtc.push({ tweet: '現在、休講等の情報は確認されていません', replies: [] })
  }
  else {
    kyukoEtc.sort((a, b) => a.tweet > b.tweet ? 1 : -1)
  }

  await postTweetsAndSelfReplies(reduceTweets(kyukoEtc, `明日（${tommorowShort}）`))
}

const tweetTodayNews = async () => {
  const today = moment().format('YYYY-MM-DD')
  const newsData = await fetchNews(today)

  if (newsData.length) {
    await postTweetsAndSelfReplies(reduceTweets(newsData, 'お知らせ（西キャンパス情報のみ）'))
  }
}

const main = async () => {
  // 明日の休講情報等を取得し、ツイートする
  await tweetTommorowKyukoEtc()

  // 今日の新着お知らせを取得し、ツイートする
  await tweetTodayNews()
}

module.exports = main
