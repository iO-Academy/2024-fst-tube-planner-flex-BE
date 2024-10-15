const express = require('express')
const app = express()
const cors = require('cors')
const {getAllStations} = require('./functions')
app.use(cors())
app.use(express.json())

app.get('/stations', getAllStations)
app.get('/message', (req, res) => {
    res.json({message:"Hello World"})
})

app.listen(3000)