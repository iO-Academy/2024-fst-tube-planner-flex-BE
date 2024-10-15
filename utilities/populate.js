const express = require('express')
const cors = require('cors')
const fs = require("node:fs")
const mysql = require('promise-mysql')

const app = express()

app.use(cors())
app.use(express.json())

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'underground'
})

let stationData = JSON.parse(fs.readFileSync('stations.json', 'utf-8'))

const addData = async ()  =>  {

    const db = await connection

    for (let tubeLine in stationData) {
        stationData[tubeLine].forEach((tubeStop, index) => {
            const line = tubeLine
            const code = tubeStop.code
            const name = tubeStop.name
            const timeToPrev = tubeStop.timeToPrev
            const timeToNext = tubeStop.timeToNext
            const zone = tubeStop.zone
            const position = index
            db.query('INSERT INTO `stations` (`code`, `name`, `timeToPrev`, `timeToNext`, `zone`, `line`, `position`) VALUES (?,?,?,?,?,?,?)', [code, name, timeToPrev, timeToNext, zone, line, position])
        })
    }
}

addData()