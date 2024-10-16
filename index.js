const express = require('express')
const app = express()
const cors = require('cors')
const {getAllStations, getJourneys} = require('./functions')
app.use(cors())
app.use(express.json())

app.get('/stations', getAllStations)
app.get('/journeys', getJourneys)

app.listen(3000)