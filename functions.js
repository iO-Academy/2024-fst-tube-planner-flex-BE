const {dbConnection} = require("./db");

const getAllStations = async (req, res) => {
    const db = await dbConnection;
    try {
        const stations = await db.query(
            'SELECT DISTINCT `code`, `name` FROM stations Order By `name` ASC')
        res.status(200).json({message: "Successfully Retrieved Stations.", data: stations})
    } catch (e) {
        res.status(500).json({message: "Unexpected Error", data: []})
    }
}

module.exports = {getAllStations}