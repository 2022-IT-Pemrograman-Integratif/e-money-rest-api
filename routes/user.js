const express = require('express');
const db = require('../config/db');
const userRouter = express.Router();
const apiRouter = require('./api');
const axios = require('axios').default;


userRouter.post('/transfer', async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const payload = token.split('.')[1]
        const decoded = Buffer.from(payload, 'base64').toString()
        var response = JSON.parse(decoded)

        const nomortujuan = req.body.nomortujuan;
        const nominal = req.body.nominal;
        const phone_sender = response.user.phone
        const balance = await db.checkbalance(phone_sender)
        let balanceAkhir = balance - nominal

        checkValidation = await db.getUserByPhone(nomortujuan);

        if (!checkValidation) {
            return res.status(404).json({
                status: "404",
                message: "Invalid phone number"
            })
        }

        if (balanceAkhir < 0) {
            return res.status(400).json({
                status: "400",
                message: "Not enough balance"
            });
        } else {
            //const deductpengitim = await db.deductpengirim(nominal, phone_sender);
            await db.deductpengirim(nominal, phone_sender);
            //const addpenerima = await db.addpenerima(nominal, nomortujuan);
            await db.addpenerima(nominal, nomortujuan);
            //updated = await db.updateHistory("transfer", nominal, phone_sender, nomortujuan);
            await db.updateHistory("transfer", nominal, phone_sender, nomortujuan);
            return res.status(200).json({
                status: "200",
                message: "Transfer success"
            });
        }
    } catch (e) {
        console.log(e);
    }
});

userRouter.get('/balance', async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const payload = token.split('.')[1]
        const decoded = Buffer.from(payload, 'base64').toString()
        var response = JSON.parse(decoded)

        const phone = response.user.phone
        const balance = await db.checkbalance(phone)

        res.status(200).json({
            status: "200",
            balance: balance
        });
    } catch (e) {
        console.log(e);
    }
});

userRouter.get('/history', async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        const payload = token.split('.')[1]
        const decoded = Buffer.from(payload, 'base64').toString()
        var response = JSON.parse(decoded)

        const phone = response.user.phone
        history = await db.getHistory(phone, "admin");
        res.status(200).json({
            status: "200",
            history: history
        });
    } catch (e) {
        console.log(e);
    }
});

userRouter.post("/transferTo", async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        const tokenDecodablePart = token.split(".")[1];
        const decoded = Buffer.from(tokenDecodablePart, "base64").toString();
        var response = JSON.parse(decoded);

        const phone_sender = response.user.phone
        const balance = await db.checkbalance(phone_sender)

        const tujuan = req.body.tujuan;
        const amount = req.body.amount;
        const emoney = req.body.emoney;

        const username = "moneyz";
        const number = "081547123069";
        const password = "moneyz123";
        const email = "moneyz@gmail.com";

        if (balance < 0 || balance < amount) {
            return res.json({
                message: "Saldo tidak cukup",
            });
        } else {

            //JNG LUPA NAMBAHIN UPDATEHISTORY
            // ========================> PEACEPAY <==========================
            if (emoney == "PeacePay") {
                const resp = await axios
                    .post("https://e-money-kelompok-12.herokuapp.com/api/login", {
                        number: number,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data.token;

                await axios
                    .post(
                        "https://e-money-kelompok-12.herokuapp.com/api/transfer", {
                        tujuan: tujuan,
                        amount: amount,
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        if (response.data.status == 200) {
                            db.deductpengirim(amount, phone_sender);
                            db.addbalanceadmin(amount, number);
                            db.updateHistory("transfer", amount, phone_sender, tujuan, "PeacePay")
                            return res.send(hasil);
                        }// => the response payload
                        else {
                            return res.send(hasil).status(400);
                        }

                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
            }
            //========================> PEACEPAY END HERE <======================


            // ========================> Buski Coins <==========================
            else if (emoney == "Buski Coins") {
                var formData = new URLSearchParams();
                formData.append("username", username);
                formData.append("password", password);
                var resp = await axios
                    .post(
                        "https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/publics/login",
                        formData
                    )
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                var tokentransfer = resp.data.message.token;

                var formData = new URLSearchParams();
                formData.append("nomer_hp", number);
                formData.append("nomer_hp_tujuan", tujuan);
                formData.append("e_money_tujuan", "Buski Coins");
                formData.append("amount", amount);
                await axios
                    .post(
                        "https://arielaliski.xyz/e-money-kelompok-2/public/buskidicoin/admin/transfer",
                        formData, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        if (response.data.status == 201) {
                            db.deductpengirim(amount, phone_sender);
                            db.addbalanceadmin(amount, number);
                            db.updateHistory("transfer", amount, phone_sender, tujuan, "Buski Coins")
                            return res.send(hasil);
                        }// => the response payload
                        else {
                            return res.send(hasil).status(400);
                        }
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
            }
            //========================> Buski Coins END HERE <==========================


            // ========================> ECoin <==========================
            else if (emoney == "ECoin") {
                const resp = await axios
                    .post("https://ecoin10.my.id/api/masuk", {
                        phone: number,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data.token;

                await axios
                    .post(
                        "http://ecoin10.my.id/api/transfer", {
                        phone: number,
                        password: password,
                        tfmethod: "1",
                        amount: amount,
                        phone2: tujuan,
                        description: "Transfer Pertama",
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        if (response.data.message == "Transfer Successful.") {
                            db.deductpengirim(amount, phone_sender);
                            db.addbalanceadmin(amount, number);
                            db.updateHistory("transfer", amount, phone_sender, tujuan, "ECoin")
                            return res.send(hasil);
                        }// => the response payload
                        else {
                            return res.send(hasil).status(400);
                        }
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
            }
            //========================> ECoin END HERE <==========================


            // ========================> Gallecoins <==========================
            else if (emoney == "Gallecoins") {
                const resp = await axios
                    .post("https://gallecoins.herokuapp.com/api/users", {
                        username: username,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data.token;

                await axios
                    .post(
                        "https://gallecoins.herokuapp.com/api/transfer", {
                        phone: tujuan,
                        amount: amount,
                        description: "Transfer Pertama",
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data;
                        if (response.data.status == 1) {
                            db.deductpengirim(amount, phone_sender);
                            db.addbalanceadmin(amount, number);
                            db.updateHistory("transfer", amount, phone_sender, tujuan, "Gallecoins")
                            return res.send(hasil);
                        }// => the response payload
                        else {
                            return res.send(hasil).status(400);
                        }

                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });

            }
            //========================> Gallecoins END HERE <==========================


            // ========================> Payfresh <==========================
            else if (emoney == "Payfresh") {
                const resp = await axios
                    .post("https://payfresh.herokuapp.com/api/login", {
                        email: email,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data.token;

                await axios
                    .post(
                        "https://payfresh.herokuapp.com/api/user/transfer/21", {
                        amount: amount,
                        phone: tujuan,
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data;// => the response payload
                        db.deductpengirim(amount, phone_sender);
                        db.addbalanceadmin(amount, number);
                        db.updateHistory("transfer", amount, phone_sender, tujuan, "Payfresh")
                        return res.send(hasil);
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });

            }
            //========================> Payfresh END HERE <==========================


            // ========================> CuanIND <==========================
            else if (emoney == "CuanIND") {
                const resp = await axios
                    .post("https://e-money-kelompok5.herokuapp.com/cuanind/user/login", {
                        notelp: number,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data;

                await axios
                    .post(
                        "https://e-money-kelompok5.herokuapp.com/cuanind/transfer", {
                        target: tujuan,
                        amount: amount,
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        db.deductpengirim(amount, phone_sender);
                        db.addbalanceadmin(amount, number);
                        db.updateHistory("transfer", amount, phone_sender, tujuan, "CuanIND")
                        return res.send(hasil);
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
            }
            //========================> CuanIND END HERE <==========================


            // ========================> PadPay <==========================
            else if (emoney == "PadPay") {
                const resp = await axios
                    .post("https://mypadpay.xyz/padpay/api/login.php", {
                        email: email,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data.Data.jwt;

                await axios
                    .put(
                        "https://mypadpay.xyz/padpay/api/transaksi.php/44", {
                        email: email,
                        password: password,
                        jwt: tokentransfer,
                        tujuan: tujuan,
                        jumlah: amount
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        db.deductpengirim(amount, phone_sender);
                        db.addbalanceadmin(amount, number);
                        db.updateHistory("transfer", amount, phone_sender, tujuan, "PadPay")
                        return res.send(hasil);
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
            }
            //========================> PadPay END HERE <==========================


            // ========================> KCN Pay <==========================
            else if (emoney == "KCN Pay") {
                const resp = await axios
                    .post("https://kecana.herokuapp.com/login", {
                        email: email,
                        password: password,
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                const tokentransfer = resp.data

                await axios
                    .post(
                        "https://kecana.herokuapp.com/transfer", {
                        id: "22",
                        nohp: tujuan,
                        nominaltransfer: amount
                    }, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        db.deductpengirim(amount, phone_sender);
                        db.addbalanceadmin(amount, number);
                        db.updateHistory("transfer", amount, phone_sender, tujuan, "KCN Pay")
                        return res.send(hasil);
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });

            }
            //========================> KCN Pay END HERE <======================


            // ========================> PayPhone <==========================
            else if (emoney == "PayPhone") {
                var formData = new URLSearchParams();
                formData.append("telepon", number);
                formData.append("password", password);
                var resp = await axios
                    .post(
                        "http://fp-payphone.herokuapp.com/public/api/login",
                        formData
                    )
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
                var tokentransfer = resp.data.token;

                var formData = new URLSearchParams();
                formData.append("telepon", tujuan);
                formData.append("jumlah", amount);
                formData.append("emoney", "payphone");
                await axios
                    .post(
                        "http://fp-payphone.herokuapp.com/public/api/transfer",
                        formData, {
                        headers: {
                            Authorization: "Bearer " + tokentransfer,
                        },
                    }
                    )
                    .then((response) => {
                        const hasil = response.data; // => the response payload
                        if (response.data.message == "Transer Berhasil") {
                            db.deductpengirim(amount, phone_sender);
                            db.addbalanceadmin(amount, number);
                            db.updateHistory("transfer", amount, phone_sender, tujuan, "PayPhone")
                            return res.send(hasil);
                        }
                        else {
                            return res.status(400).send(hasil)
                        }
                    })
                    .catch((error) => {
                        if (error.response) {
                            const err = error.response.data; // => the response payload
                            return res.send(err);
                        }
                    });
            }
            else {
                return res.status(400).json({
                    message: "Emoney Tidak tersedia, Coba ulang dengan nama Emoney yang benar (case sensitive)",
                    daftarEmoney: [
                        "Buski Coins",
                        "KCN Pay",
                        "Gallecoins",
                        "CuanIND",
                        "Payfresh",
                        "PadPay",
                        "PayPhone",
                        "ECoin",
                        "Talangin",
                        "PeacePay",
                    ],
                });
            }
            //========================> ECOINS END HERE <==========================
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = userRouter;