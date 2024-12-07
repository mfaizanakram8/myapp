const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create user registration
app.post('/register', (request, response) => {
    const { username, password, firstname, lastname, creditinfo, address, email, phone } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.registerUser(username, password, firstname, lastname, creditinfo, address, email, phone);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Get all users
app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();
    const result = db.getAllUsers();
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search users by name
app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = name === "all" ? db.getAllUsers() : db.searchByName(name);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Search user by ID
app.get('/searchByID/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.searchByID(id);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Credit info range filter
app.get('/filterByCreditInfo', (request, response) => {
    const { minCredit, maxCredit } = request.query;
    const db = dbService.getDbServiceInstance();
    const result = db.filterByCreditInfo(minCredit, maxCredit);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Delete user
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// Update user details
app.patch('/update', (request, response) => {
    const { id, firstname, lastname, creditinfo, address, email, phone } = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.updateUserById(id, firstname, lastname, creditinfo, address, email, phone);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// Server listener
app.listen(5050, () => {
    console.log("Server is running on port 5050");
});
