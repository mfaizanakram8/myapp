const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async registerUser(username, password, firstname, lastname, creditinfo, address, email, phone) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "INSERT INTO Users (username, password, firstname, lastname, creditinfo, address, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
                connection.query(query, [username, password, firstname, lastname, creditinfo, address, email, phone], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.insertId);
                });
            });
            return { id: result, username };
        } catch (error) {
            console.log(error);
        }
    }

    async filterByCreditInfo(minCredit, maxCredit) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Users WHERE creditinfo BETWEEN ? AND ?;";
                connection.query(query, [minCredit, maxCredit], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async updateUserById(id, firstname, lastname, creditinfo, address, email, phone) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE Users SET firstname = ?, lastname = ?, creditinfo = ?, address = ?, email = ?, phone = ? WHERE id = ?;";
                connection.query(query, [firstname, lastname, creditinfo, address, email, phone, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.affectedRows === 1);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getAllUsers() {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Users;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async searchByID(id) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Users WHERE id = ?;";
                connection.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async searchByName(name) {
        try {
            const result = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM Users WHERE firstname LIKE ? OR lastname LIKE ?;";
                connection.query(query, [`%${name}%`, `%${name}%`], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM Users WHERE id = ?;";
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result.affectedRows === 1);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = DbService;
