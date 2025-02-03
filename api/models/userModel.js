const db = require('../dbConnec');

// Create a new user
exports.createUser = async (data) => {
    const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [data.username, data.email, data.password]
    );
    return result.insertId;
};

// Find a user by email
exports.findUserByEmail = async (email) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// Find a user by ID
exports.findUserById = async (id) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
};

// Find all users 
exports.findAllUsers = async () => {
    const [rows] = await db.execute('SELECT * FROM users ');
    return rows;
};
