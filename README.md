# e-money-kelompok-6

## Kelompok 6:  
Rachmita Annisa Aulia - 5027201032  
Afrida Rohmatin Nuriyah - 5027201037  
Shafira Khaerunnisa Latif - 5027201072  

## Nama e-money: MoneyZ  

## Dokumentasi API:  

| Endpoint | Akses | Deskripsi | 
| ----------- | ----------- | ----------- | 
| register | admin dan user | API untuk membuat akun baru agar dapat login  |  
| login | admin dan user | API untuk masuk ke akun dan dapat mengakses MoneyZ |  
| getalluser | admin | API untuk mengambil data semua user |  
| topup | admin | API untuk mengupdate saldo  |  
| transfer | admin | API untuk mengirim saldo ke user lain | 
| balance | user | API untuk mengambil data jumlah saldo yang dimiliki secara real-time |  
| history | user | API untuk mendapatkan riwayat dari seluruh transaksi yang telah dilakukan (top up, dan transfer antar teman) |  

### register
  * Method : `POST`
  * Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/register
  * Autentikasi : -
  * Parameter :

| Parameter | Description | Optional | Default | 
| ----------- | ----------- | ----------- | ----------- |
| username | Berupa string dengan panjang min. 3 char dan tidak boleh sama dengan user lain |  |  |
| email | Berupa string dan angka dengan panjang min. 8 char |  |  |
| password | Berupa email user dengan format menggunakan @ dan belum pernah digunakan untuk register sebelumnya |  |  |
| phone | Berupa nomor hp user dengan panjang max. 15 char dan belum pernah digunakan untuk register sebelumnnya |  |  |
  
 * Contoh 1

`POST`  https://moneyz-kelompok6.herokuapp.com/api/register

Parameter
```
{
    "username": "tesdokumentasi",
    "password": "tesdokumentasi123",
    "email": "tesdokumentasi@gmail.com",
    "phone": "08934238940"
}
```
Respon

![responregister1.png](images/responregister1.PNG)


 * Contoh 2
 
 `POST`	https://moneyz-kelompok6.herokuapp.com/api/register

Parameter
```
{
    "username": "tesdokumentasi",
    "password": "tesdokumentasi123",
    "email": "tesdokumentasi@gmail.com",
    "phone": "08934238940"
}
```
Respon

![responregister2.png](images/responregister2.PNG)


### login

* Method : `POST`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/login
* Autentikasi : -
* Parameter

| Parameter | Description | Optional | Default | 
| ----------- | ----------- | ----------- | ----------- |  
| phone | Brupa string nomor hp yang sudah terdaftar saat register |  |  |
| password | Berupa string yang sudah terdaftar saat register |  |  |

* Contoh 1

Contoh 1
`POST`		https://moneyz-kelompok6.herokuapp.com/api/login

Parameter
```
{
    "username": "tesdokumentasi",
    "password": "tesdokumentasi123"
}
```
Respon

![responlogin1.png](images/responlogin1.PNG)


* Contoh 2

`POST` 	https://moneyz-kelompok6.herokuapp.com/api/login

Parameter
```
{
    "username": "tesdokumentasi",
    "password": "tesdokumentasi1234"
}
```

Respon

![responlogin2.png](images/responlogin2.PNG)


### getalluser

* Method : `GET`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/admin/
* Autentikasi : Admin
* Parameter : -

* Contoh 1

`GET`		https://moneyz-kelompok6.herokuapp.com/api/admin

Respon

![respongetalluser1.png](images/respongetalluser1.PNG)


* Contoh 2

`GET`		https://moneyz-kelompok6.herokuapp.com/api/admin

Respon

![respongetalluser2.png](images/respongetalluser2.PNG)


### topup

* Method : `POST`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/admin/topup
* Autentikasi : Admin
* Parameter

| Parameter | Description | Optional | Default | 
| ----------- | ----------- | ----------- | ----------- |
| nominal | Berupa jumlah uang yang akan ditambahkan ke akun MoneyZ user|  |  |

* Contoh 1

`POST`		https://moneyz-kelompok6.herokuapp.com/api/admin/topup

Parameter
```
{
    "nominal": "10000"
}
```

Respon

![respontopup1.png](images/respontopup1.PNG)


* Contoh 2

`POST`		https://moneyz-kelompok6.herokuapp.com/api/admin/topup

Parameter
```
{
    "nominal": "10000"
}
```

Respon

![respontopup2.png](images/respontopup2.PNG)


### transfer

* Method : `POST`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/user/transfer
* Autentikasi : User
* Parameter

| Parameter | Description | Optional | Default | 
| ----------- | ----------- | ----------- | ----------- |
| nomortujuan | Berupa nomor hp tujuan yang menjadi identitas dari data terkait. perlu diisi apabila ingin melakukan pengiriman uang | Tidak | |
| nominal | Berupa jumlah uang yang akan ditransfer ke akun MoneyZ user | Tidak | 0 |

* Contoh 1

`POST`		https://moneyz-kelompok6.herokuapp.com/api/user/transfer

Parameter
```
{
     "idtujuan": "13",
     "nominal": "5000"
}
```
Respon

![respontransfer1.png](images/respontransfer1.PNG)


* Contoh 2

`POST` 	https://moneyz-kelompok6.herokuapp.com/api/user/transfer

Parameter
```
{
    "idtujuan": "13",
    "nominal": "5000"
}
```

Respon

![respontransfer2.png](images/respontransfer2.PNG)


### balance

* Method : `GET`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/user/balance
* Autentikasi : User
* Parameter : -


* Contoh 1

`GET`		https://moneyz-kelompok6.herokuapp.com/api/user/balance/:id

Respon

![responbalance1.png](images/responbalance1.PNG)


* Contoh 2

`GET`	https://moneyz-kelompok6.herokuapp.com/api/user/transfer/12

Respon

![responbalance2.png](images/responbalance2.PNG)


### history

* Method : `GET`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/user/history
* Autentikasi : User
* Parameter : -

* Contoh 1

`GET`		https://moneyz-kelompok6.herokuapp.com/api/user/history

Respon

![responhistory1.png](images/responhistory1.PNG)


* Contoh 2

`GET`		https://moneyz-kelompok6.herokuapp.com/api/user/history

Respon

![responhistory2.png](images/responhistory2.PNG)



e-money-kelompok-6 created by GitHub Classroom
