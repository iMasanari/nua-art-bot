const postTweet = require('./postTweet')
const getTweetsData = require('./getTweetsData')

/** @typedef {{ tweet: string, replies: string[] }} TweetData */

const isDevelop = process.env.NODE_ENV === 'develop'

const getTommorow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)

  return `${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * @param {TweetData[]} tweets
 * @return {TweetData[]}
 */
const reduceTweets = (tweets) =>
  tweets.reduce((newTweets, tweetData) => {
    let last = newTweets[newTweets.length - 1]

    if (!last || last.tweet.length + tweetData.tweet.length > 140) {
      last = {
        tweet: '明日',
        replies: [],
      }
      newTweets.push(last)
    }

    last.tweet += '\n' + tweetData.tweet
    last.replies.push(...tweetData.replies)

    return newTweets
  }, [])

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
  const tweetsData = await getTweetsData()
  const tommorow = getTommorow()

  const tweets = reduceTweets(tweetsData.filter(v => v.date === tommorow))

  if (isDevelop) {
    return console.log(tweets)
  }
  
  postTweetsAndSelfReplies(tweets)
}

module.exports = main
