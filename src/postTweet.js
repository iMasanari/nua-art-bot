const Twitter = require('twitter')
const token = require('../token.json').twitter

const isDevelop = process.env.NODE_ENV === 'develop'
const client = new Twitter(token)

/**
 * @param {string} tweetText
 * @param {string=} replyId
 * @return {Promise.<{id_str: string}>}
 */
const postTweet = (tweetText, replyId) => {
  if (isDevelop) {
    console.log(tweetText)
    return Promise.resolve({ id_str: 'test' })
  }

  return client.post('statuses/update', {
    status: tweetText,
    in_reply_to_status_id: replyId,
  })
}

module.exports = postTweet
