const express = require('express');
const apiRouter = express.Router();

const jsonwebtoken = require('jsonwebtoken');
const db = require('./db');
const {
    hashSync,
    genSaltSync,
    compareSync
} = require("bcrypt");
const cookieParser = require('cookie-parser');

const adminrouter = require('./admin');
const userRouter = require('./user');


apiRouter.use(cookieParser());

apiRouter.post('/register', async (req, res, next) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const phone = req.body.phone;
        let password = req.body.password;

        checkUsername = await db.getUserByUsername(username);
        checkEmail = await db.getUserByEmail(email);
        checkPhone = await db.getUserByPhone(phone);


        if (!username || !email || !password || !phone) {
            return res.sendStatus(400);
        } else if (checkUsername || checkEmail || checkPhone) {
            return res.json({
                message: "Username/email/phone has been taken"
            })
        }

        const salt = genSaltSync(10);
        password = hashSync(password, salt);

        const user = await db.insertUser(username, email, password, phone);

        const jsontoken = jsonwebtoken.sign({
            user: user
        }, "inibuatmaniez", {
            expiresIn: '30m'
        });

        res.cookie('token', jsontoken, {
            httpOnly: true,
            secure: true,
            expires: new Date(Number(new Date()) + 30 * 60 * 1000)
        }); //we add secure: true, when using https.


        res.json({
            token: jsontoken
        });

        //return res.redirect('/mainpage');

    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});




apiRouter.post('/login', async (req, res, next) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        user = await db.getUserByUsername(username);

        if (!user) {
            return res.json({
                message: "Invalid Username or password"
            })
        }

        const isValidPassword = compareSync(password, user.password);
        if (isValidPassword) {
            user.password = undefined;
            const jsontoken = jsonwebtoken.sign({
                user: user
            }, "inibuatmaniez", {
                expiresIn: '30m'
            });
            res.cookie('token', jsontoken, {
                httpOnly: true,
                secure: true,
                expires: new Date(Number(new Date()) + 30 * 60 * 1000)
            }); //we add secure: true, when using https.

            res.json({
                token: jsontoken
            });
            //return res.redirect('/mainpage') ;

        } else {
            return res.json({
                message: "Invalid Username or password"
            });
        }

    } catch (e) {
        console.log(e);
    }
});


//  Verify Token
async function verifyTokenAdmin(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === undefined) {

        return res.json({
            message: "Access Denied! Unauthorized User"
        });
    } else {

        jsonwebtoken.verify(token, "inibuatmaniez", (err, authData) => {
            if (err) {
                res.json({
                    message: "Invalid Token..."
                });

            } else {

                const role = authData.user.role;
                if (role === "admin") {
                    next();
                } else {
                    return res.json({
                        message: "Access Denied!"
                    });

                }
            }
        })
    }
}

async function verifyToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === undefined) {

        return res.json({
            message: "Access Denied! Unauthorized User"
        });
    } else {

        jsonwebtoken.verify(token, "inibuatmaniez", (err, authData) => {
            if (err) {
                res.json({
                    message: "Invalid Token..."
                });

            } else {

                const role = authData.user.role;
                if (role === "user") {
                    next();
                } else {
                    return res.json({
                        message: "Access Denied!"
                    });

                }
            }
        })
    }
}

apiRouter.use('/admin', verifyTokenAdmin, adminrouter);

apiRouter.use('/user', verifyToken, userRouter);


module.exports = apiRouter;