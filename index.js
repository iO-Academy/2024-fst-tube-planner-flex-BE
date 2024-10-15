const express = require('express')
const app = express()
const {getAllStations} = require('./functions')

app.get('/stations', getAllStations )

app.listen(3000)