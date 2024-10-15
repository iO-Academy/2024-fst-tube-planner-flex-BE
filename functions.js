const {dbConnection} = require("./db");
const mysql = require('promise-mysql')


const getAllStations = async (req, res) => {
    const db = await dbConnection;
    try {
        const stations = db.query(
            'SELECT DISTINCT `code`, `name`, `ID` FROM stations Order By `name` ASC')
        res.status(200).json({message: "Successfully Retrieved Stations.", data: stations})
        res.send(stations)
    } catch (e) {
        res.status(500).json({message: "Unexpected Error", data: []})
    }
}

module.exports = {getAllStations}