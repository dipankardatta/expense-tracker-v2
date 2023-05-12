const express = require('express')
const app = express()
const port = 3000

app.post('/users/signup', (req, res) => {
  res.send('GOT A POST REQUEST')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})