const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'messages',
    password: 'password',
    port: 5432,
})

const getMessages = (req, res) => {
    const group = req.params.group;
    const channel = req.params.channel;

    return pool.query('SELECT * FROM messages WHERE group_name = $1 AND channel = $2', [group, channel], (error, results) => {
        if (error) {
            throw error;
        }
        return results;
    });
}

const createMessage = (req, res) => {
    const {group_name, channel, username, time, text} = request.body;

    pool.query('INSERT INTO messages ' +
        '(group_name, channel, username, time, text) VALUES ($1, $2, $3, $4, $5)',
        [group_name, channel, username, time, text], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(201).send(`message added with ID: ${results.insertId}`);
    })
}

module.exports = {
    getMessages,
    createMessage
}