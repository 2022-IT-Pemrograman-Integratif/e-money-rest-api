const express = require('express');
const db = require('./db');
const adminrouter = express.Router();

const {
    hashSync,
    genSaltSync,
    compareSync
} = require("bcrypt");


adminrouter.param('userId', async (req, res, next, userId) => {
    try {
        const user = await db.getOne("User", userId);
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        res.sendStatus(404);
    }
});



adminrouter.get('/:userId', (req, res, next) => {
    res.status(200).json({
        user: req.user
    });

});




adminrouter.post('/', async (req, res, next) => {
    try {
        const username = req.body.user.username;
        const email = req.body.user.email;
        let password = req.body.user.password;


        if (!username || !email || !password) {
            return res.sendStatus(400);
        }

        const salt = genSaltSync(10);
        password = hashSync(password, salt);



        const user = await db.insertUser(username, email, password);
        res.json({
            user: user
        });


    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});




adminrouter.put('/:id', async (req, res, next) => {
    try {
        const username = req.body.user.username;
        const role = req.body.user.role;
        const email = req.body.user.email;
        let password = req.body.user.password;
        const userId = req.params.id;
        const phone = req.body.user.phone;


        if (!username || !role || !email || !password || !phone) {
            return res.sendStatus(400);
        }

        const salt = genSaltSync(10);
        password = hashSync(password, salt);



        const user = await db.updateUser(username, role, email, password, userId, phone);
        res.json({
            message: "user updated"
        });


    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});



adminrouter.delete('/:id', async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await db.deleteUser(userId);
        return res.sendStatus(204);

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});



adminrouter.get('/', async (req, res, next) => {
    try {
        const users = await db.allUser();
        res.json({
            users: users
        });
    } catch (e) {
        console.log(e);
    }
});

adminrouter.post('/topup/:id', async (req, res, next) => {
    try {
        const nominal = req.body.nominal;
        const userId = req.params.id


        if (!nominal) {
            return res.sendStatus(400);
        }

        const balance = await db.topupuser(nominal, userId);
        const updated = await db.updateHistory("topup", nominal, userId);
        //res.json({
        //    balance: balance
        //});
        res.json({
            message: "top up success"
        });


    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});


module.exports = adminrouter;