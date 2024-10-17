const {dbConnection} = require("./db");

const getAllStations = async (req, res) => {
    const db = await dbConnection
    try {
        const stations = await db.query('SELECT DISTINCT `code`, `name` FROM stations Order By `name` ASC')
        res.status(200).json({message: "Successfully Retrieved Stations.", data: stations})
    } catch (e) {
        res.status(500).json({message: "Unexpected Error", data: []})
    }
}

const getStationInstances = async (stationCode) => {
    const db = await dbConnection
    return db.query('SELECT `id`, `code`, `name`, `timeToPrev`, `timeToNext`, `zone`, `line`, `position` FROM `stations` WHERE `code` = ?', [stationCode])
}

const getSingleLineJourney = async (line, start, end) => {
    const db = await dbConnection
    return db.query('SELECT `id`, `code`, `name`, `timeToPrev`, `timeToNext`, `zone`, `line`, `position` FROM `stations` WHERE `line` = ? AND `position` >= ? AND `position` <= ?', [line, start, end])
}

const generateJourneySummaries = (journeys, originCode) => {
    let summaries = []

    for (const journey of journeys) {

        let firstStation = journey[0]
        let lastStation = journey[journey.length - 1]

        if (journey[0].code === originCode) {
            const from = firstStation.name
            const to = lastStation.name
            const line = firstStation.line
            const time = journey.map(station => station.timeToNext).reduce((accumulator, currentValue) => accumulator + currentValue)
            const stationBreakdown = journey.map(station => [station.name, station.timeToNext])
            summaries.push({
                from: from, to: to, line: line, time: time, stations: stationBreakdown
            })
        } else {
            const from = lastStation.name
            const to = firstStation.name
            const line = lastStation.line
            const time = journey.map(station => station.timeToPrev).reduce((accumulator, currentValue) => accumulator + currentValue)
            const stationBreakdown = journey.map(station => [station.name, station.timeToPrev]).reverse()
            summaries.push({
                from: from, to: to, line: line, time: time, stations: stationBreakdown
            })
        }
    }
    return summaries
}

const getJourneys = async (req, res) => {
    try {
        const {origin: originSelection, destination: destinationSelection} = req.query
        if (!originSelection || !destinationSelection) {
            res.status(400).json({message: "Origin and Destination are required."})
        } else {
            const origins = await getStationInstances(originSelection)
            const destinations = await getStationInstances(destinationSelection)

            const originLines = origins.map(station => station.line)
            const destinationLines = destinations.map(station => station.line)

            const pairs = originLines.reduce((accumulator, line, originIndex) => {
                const destinationIndex = destinationLines.indexOf(line)
                if (destinationIndex !== -1) {
                    accumulator.push([originIndex, destinationIndex])
                }
                return accumulator
            }, [])

            let routes = pairs.map(([originIndex, destinationIndex]) => {
                const originStation = origins[originIndex];
                const destinationStation = destinations[destinationIndex];

                return {
                    line: originStation.line,
                    start: Math.min(originStation.position, destinationStation.position),
                    end: Math.max(originStation.position, destinationStation.position)
                }
            })

            const journeys = []
            for (const route of routes) {
                let journey = await getSingleLineJourney(route.line, route.start, route.end);
                journeys.push(journey);
            }

            let journeySummaries = generateJourneySummaries(journeys, originSelection)

            if (journeys.length > 0) {
                res.status(200).json({
                    message: "Successfully Retrieved Journeys.", summary: journeySummaries
                })
            } else {
                res.status(204).json({message: "No Valid Journeys", data: []})
            }
        }
    } catch (e) {
        res.status(500).json({message: "Unexpected Error", data: []})
    }
}

module.exports = {getAllStations, getJourneys}