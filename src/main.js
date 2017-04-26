/* @flow */
const postTweet = require('./postTweet')
const getTweetsData = require('./getTweetsData')
const getTodayNews = require('./getTodayNews')

/*::
  type TweetData = {
    tweet: string,
    replies: string[],
    date?: string
  }
*/

const isDevelop = process.env.NODE_ENV === 'develop'

const getTommorow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)

  return `${date.getMonth() + 1}/${date.getDate()}`
}

const reduceTweets = (tweets /*: TweetData[] */, tweetHeader = '') =>
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
  }, ([] /*: TweetData[] */))

const postTweetsAndSelfReplies = async (tweets /*: TweetData[] */) => {
  for (const { tweet, replies } of tweets) {
    const res = await postTweet(tweet)

    let replyId = res.id_str

    for (const reply of replies) {
      const res = await postTweet(reply, replyId)

      replyId = res.id_str
    }
  }
}

const tweetTommorowKogi = async () => {
  const tweetsData = await getTweetsData()

  const tommorow = getTommorow()
  const tommorowTweetsData = tweetsData
    .filter(v => v.date === tommorow)
    .sort((a, b) => a.tweet > b.tweet ? 1 : -1)

  if (tommorowTweetsData.length === 0) {
    tommorowTweetsData.push({
      tweet: `${tommorow}の情報はありません`,
      replies: []
    })
  }

  const tweets = reduceTweets(tommorowTweetsData, `明日（${tommorow}）`)

  await postTweetsAndSelfReplies(tweets)
}

const tweetTodayNews = async () => {
  const tweetsData = await getTodayNews()
  const tweets = reduceTweets(tweetsData, 'お知らせ')

  await postTweetsAndSelfReplies(tweets)
}

const main = async () => {
  await tweetTommorowKogi()
  await tweetTodayNews()
}

module.exports = main
