const mysql = require("promise-mysql");
const dbConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'underground'
})

module.exports = {dbConnection}