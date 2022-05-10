const { reject } = require('bcrypt/promises');
const mysql = require('mysql');



const pool = mysql.createPool({
    connectionLimit: "10", // the number of connections node.js will hold open to our database
    password: "",
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT

});


let db = {};

// ***Requests to the User table ***

db.allUser = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users ', (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users);
        });
    });
};


db.getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = ?', [username], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

db.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE email = ?', [email], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

db.getUserByPhone = (phone) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE phone = ?', [phone], (error, users) => {
            if (error) {
                return reject(error);
            }
            return resolve(users[0]);
        });
    });
};

db.insertUser = (username, email, password, phone) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)', [username, email, password, phone], (error, result) => {
            if (error) {
                return reject(error);
            }

            return resolve(result.insertId);
        });
    });
};


db.updateUser = (username, role, email, password, id, phone) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET username = ?, role= ?, email= ?, password=?, phone=? WHERE id_user = ?', [username, role, email, password, phone, id], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};



db.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE id = ?', [id], (error) => {
            if (error) {
                return reject(error);
            }
            return resolve(console.log("User deleted"));
        });
    });
};

db.topupuser = (nominal, phone) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance + ? WHERE phone = ?', [nominal, phone], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.deductpengirim = (nominal, phone_sender) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance - ? WHERE phone = ?', [nominal, phone_sender], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.addpenerima = (nominal, nomorpenerima) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance + ? WHERE phone = ?', [nominal, nomorpenerima], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.addbalanceadmin = (nominal, nomorpenerima) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance + ? WHERE phone = ?', [nominal, nomorpenerima], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.checkbalance = (phone) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance FROM users WHERE phone = ?', [phone], (error, balance) => {
            if (error) {
                return reject(error);
            }
            return resolve(balance[0].balance);
        });
    });
};

db.updateHistory = (type, nominal, phone_sender, phone_receiver, emoney) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO history (type, amount, phone_sender, phone_receiver, emoney) VALUES (?, ?, ?, ?, ?)', [type, nominal, phone_sender, phone_receiver, emoney], (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
};

db.getHistory = (phone, admin) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT type, phone_receiver, emoney, amount, timestamp FROM history WHERE phone_receiver = ? OR phone_sender = ? ', [phone, phone], (error, history) => {
            if (error) {
                return reject(error);
            }
            return resolve(history);
        });
    });
};


module.exports = db