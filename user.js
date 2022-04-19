const express = require('express');
const db = require('./db');
const userRouter = express.Router();
const apiRouter = require('./api');

const {
    hashSync,
    genSaltSync,
    compareSync
} = require("bcrypt");


userRouter.post('/transfer/:id', async (req, res, next) => {
    try {
        const idtujuan = req.body.idtujuan;
        const nominal = req.body.nominal;
        const idpengirim = req.params.id;

        balancepengirim = await db.checkbalance(idpengirim);


        if (balancepengirim < 0 || balancepengirim <= nominal) {
            return res.json({
                message: "Saldo tidak cukup"
            });
        } else {
            const deductpengirim = await db.deductpengirim(nominal, idpengirim);
            const addpenerima = await db.addpenerima(nominal, idtujuan);
            updated = await db.updateHistory("transfer", nominal, idpengirim, idtujuan);
            return res.json({
                message: "Transfer Berhasil"
            });
        }

    } catch (e) {
        console.log(e);
    }
});

userRouter.get('/balance/:id', async (req, res, next) => {
    try {
        const id_user = req.params.id;

        balance = await db.checkbalance(id_user);

        res.json({
            balance
        });
    } catch (e) {
        console.log(e);
    }
});

userRouter.get('/history/:id', async (req, res, next) => {
    try {
        const id_user = req.params.id;

        const history = await db.getHistory(id_user);

        res.json({
            history: history
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = userRouter;