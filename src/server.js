require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const rfs = require('rotating-file-stream') // version 2.x
const { router : yrunnerRoute } = require('./routes/yrunnerRoute')
const { handle404 } = require('./middleware/handle404')
const { showBanners } = require('./utils/showBanners')

const app = express()
app.use(express.json());
app.use(cors());

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'logs')
  })
   
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/api/v1/yr', yrunnerRoute)

app.all('/*', handle404)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server started on ${process.env.SERVER_PORT}...`)    
    showBanners()
})

/*
   Introduction to the Node-oracledb Driver for Oracle Database
   https://node-oracledb.readthedocs.io/en/latest/user_guide/introduction.html#getting-started-with-node-oracledb

   node-oracledb/examples
   https://github.com/oracle/node-oracledb/tree/main/examples
   
   Oracle Instant Client Downloads for Microsoft Windows (x64) 64-bit
   https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html

   Node.js node-oracledb version 5.5
   https://oracle.github.io/node-oracledb/

   YRunner ─ The Accidental HA
   https://github.com/Albert0i/misdoc/blob/main/YRTAHA.md

   The Mystery of Marie Rogêt
   https://poemuseum.org/the-mystery-of-marie-roget/

*/