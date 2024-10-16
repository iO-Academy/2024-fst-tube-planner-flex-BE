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

const getJourneys = async (req, res) => {
    try {
        // Get Query Params & Check they're populated. Throw Bad Request.
        const {origin: originSelection, destination: destinationSelection} = req.query
        if (!originSelection || !destinationSelection) {
            res.status(400).json({message: "Origin and Destination are required."})
        }

        // Unique Stations on Dropdown requires selection of all instances of Origins and Destinations...
        const origins = await getOriginStations(originSelection)
        const destinations = await getDestinationStations(destinationSelection)

        // Extract Lines to See if Single Line is Possible
        const originLines = origins.map(station => station.line)
        const destinationLines = destinations.map(station => station.line)

        // Create Pairs of Origins and Destinations. Stations Exist across multiple Lines.
        const pairs = originLines.reduce((accumulator, line, originIndex) => {
            const destinationIndex = destinationLines.indexOf(line)
            if (destinationIndex !== -1) {
                accumulator.push([originIndex, destinationIndex])
            }
            return accumulator
        }, [])

        // Create Routes populated with Origin and Destination station Details
        let routes = pairs.map(([originIndex, destinationIndex]) => {
            const originStation = origins[originIndex];
            const destinationStation = destinations[destinationIndex];

            return {
                line: originStation.line,
                start: Math.min(originStation.position, destinationStation.position),
                end: Math.max(originStation.position, destinationStation.position)
            }
        })

        //Query Journey Data
        const journeys = []
        for (const route of routes) {
            let journey = await getSingleLineJourney(route.line, route.start, route.end);
            journeys.push(journey);
        }

        //Summarise data to provide information in the format of end Route Card
        const journeySummaries = []

        for (const journey of journeys) {

            let journeyArrayLength = journey.length - 1

            if (journey[0].code === originSelection) {
                const from = journey[0].name
                const to = journey[journeyArrayLength].name
                const line = journey[0].line
                const stationBreakdown = journey.map(station => station.name)
                journeySummaries.push({
                    from: from, to: to, line: line, Stations: stationBreakdown
                })
            } else {
                const from = journey[journeyArrayLength].name
                const to = journey[0].name
                const line = journey[journeyArrayLength].line
                const stationBreakdown = journey.map(station => station.name).reverse()
                journeySummaries.push({
                    from: from, to: to, Line: line, Stations: stationBreakdown
                })
            }
        }

        // Render Data back to the request
        if (journeys.length > 0) {
            res.status(200).json({
                message: "Successfully Retrieved Journeys.", data: journeys, summary: journeySummaries
            })
        } else {
            res.status(204).json({message: "No Valid Journeys", data: []})
        }
    } catch (e) {
        res.status(500).json({message: "Unexpected Error", data: []})
    }
}

const getOriginStations = async (originCode) => {
    const db = await dbConnection
    return db.query('SELECT `id`, `code`, `name`, `timeToPrev`, `timeToNext`, `zone`, `line`, `position` FROM `stations` WHERE `code` = ?', [originCode])
}

const getDestinationStations = async (destinationCode) => {
    const db = await dbConnection
    return db.query('SELECT `id`, `code`, `name`, `timeToPrev`, `timeToNext`, `zone`, `line`, `position` FROM `stations` WHERE `code` = ?', [destinationCode])
}

const getSingleLineJourney = async (line, start, end) => {
    const db = await dbConnection
    return db.query('SELECT `id`, `code`, `name`, `timeToPrev`, `timeToNext`, `zone`, `line`, `position` FROM `stations` WHERE `line` = ? AND `position` >= ? AND `position` <= ?', [line, start, end])
}

module.exports = {getAllStations, getJourneys}