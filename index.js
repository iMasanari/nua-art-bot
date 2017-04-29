const main = require('./src/main')
const postTweet = require('./src/postTweet')

main().catch((error) => {
  postTweet(`@iMasanari ${error}`)
  console.dir(error)
})
