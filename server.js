/* @flow */
// Herokuはアドオンで定期実行が可能だが、追加にクレジット認証が必要
// なのでwebとして公開し、外部からurlを叩いて定期実行する

const express = require('express')
const main = require('./src/main')
const postTweet = require('./src/postTweet')

const app = express()
const port = process.env.PORT || 3000

const runCommand = process.env.BOT_RUN_COMMAND_TYPE || 'run'
const testCommand = process.env.BOT_TEST_COMMAND_TYPE || 'test'

app.get('/', (req, res) => {
  res.send('Hello World!')

  switch (req.query.command) {
    case runCommand: {
      main()
      break
    }
    case testCommand: {
      postTweet(`@no_TL test tweet - ${new Date().toString()}`)
      break
    }
  }
})

app.listen(port)
