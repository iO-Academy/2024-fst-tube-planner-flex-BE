const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('promise-mysql')
const fs = require("node:fs")

let data = JSON.parse(fs.readFileSync('stations.json', 'utf-8'))

app.use(cors())
app.use(express.json())
app.get('/underground', async (request, response) => {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'films'
    })

    const stations = await connection.query('INSERT INTO stations VALUES')

    response.get(stations)
})

app.get('/message', (req,res) => {
    res.json({message: "Hello from server!"})
})


app.listen(3000)