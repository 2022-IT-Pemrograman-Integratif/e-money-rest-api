const { reject } = require('bcrypt/promises');
const mysql = require('mysql');



const pool = mysql.createPool({
    connectionLimit: "10", // the number of connections node.js will hold open to our database
    password: "",
    user: "root",
    database: "moneyz",
    host: "localhost",
    port: "3306"

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

db.topupuser = (nominal, userId) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance + ? WHERE id_user = ?', [nominal, userId], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.deductpengirim = (nominal, idpengirim) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance - ? WHERE id_user = ?', [nominal, idpengirim], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.addpenerima = (nominal, idpenerima) => {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE users SET balance = balance + ? WHERE id_user = ?', [nominal, idpenerima], (error) => {
            if (error) {
                return reject(error);
            }

            return resolve();
        });
    });
};

db.checkbalance = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT balance FROM users WHERE id_user = ?', [userId], (error, balance) => {
            if (error) {
                return reject(error);
            }
            return resolve(balance[0].balance);
        });
    });
};

db.updateHistory = (type, nominal, userId, idpenerima) => {
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO history (type, amount, id_user, id_penerima) VALUES (?, ?, ?, ?)', [type, nominal, userId, idpenerima], (error) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    });
};

db.getHistory = (userId) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT type, id_penerima, amount FROM history WHERE id_user = ? ', [userId], (error, history) => {
            if (error) {
                return reject(error);
            }
            return resolve(history);
        });
    });
};


module.exports = db