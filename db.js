
require('dotenv').config()
const { Pool, Client } = require('pg'),
    pool = new Pool()

exports.raw = async (statement, params) => {
    // the pool will emit an error on behalf of any idle clients it contains if a backend error or network partition happens
    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    try {
        // console.log('connecting to ' + process.env.PGHOST + ':' + process.env.PGPORT + '/' + process.env.PGDATABASE + ', user ' + process.env.PGUSER)
        const client = await pool.connect()
        // console.log('connected, running ' + statement)
        let res
        try {
            res = await client.query(statement, params)
        } finally {
            // Make sure to release the client before any error handling, just in case the error handling itself throws an error.
            client.release()
            return res
        }
    } catch (err) { console.log(err.stack) }
}