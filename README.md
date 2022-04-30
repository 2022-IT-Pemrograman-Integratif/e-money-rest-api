# e-money-kelompok-6

## Kelompok 6:  
Rachmita Annisa Aulia - 5027201032  
Afrida Rohmatin Nuriyah - 5027201037  
Shafira Khaerunnisa Latif - 5027201072  

## Nama e-money: MoneyZ  

## Dokumentasi API:  

| Endpoint | Autentikasi | Deskripsi | 
| ----------- | ----------- | ----------- | 
| register | Admin dan user | API untuk membuat akun baru agar dapat login  |  
| login | Admin dan user | API untuk masuk ke akun dan dapat mengakses MoneyZ |  
| getalluser | Admin | API untuk mengambil data semua user |  
| topup | Admin | API untuk menambah saldo pada user  |  
| transfer | User | API untuk mengirim saldo ke user lain | 
| balance | User | API untuk mengambil data jumlah saldo yang dimiliki secara real-time |  
| history | User | API untuk mendapatkan riwayat dari seluruh transaksi yang telah dilakukan (top up, dan transfer antar teman) |  

### register
  * Method : `POST`
  * Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/register
  * Autentikasi : -
  * Parameter :

| Parameter | Description | 
| ----------- | ----------- | 
| username | Berupa string dan tidak boleh sama dengan user lain |
| email | Berupa email user dengan format menggunakan @ dan belum pernah digunakan untuk register sebelumnya |
| password | Bebas berupa string atau angka dan tidak ada ketentuan |
| phone | Berupa nomor hp user dengan panjang max. 15 char dan belum pernah digunakan untuk register sebelumnnya |
  
 * Contoh 1

`POST`  https://moneyz-kelompok6.herokuapp.com/api/register

Parameter
```
{
    "username": "fordocumnentation",
    "password": "fordocumentation123",
    "email": "fordocumentation@gmail.com",
    "phone": "08123456789"
}
```
Respon

![regis1](https://user-images.githubusercontent.com/90240714/165981603-d3fe860f-2759-4847-b0a9-454de610c5b0.JPG)


 * Contoh 2
 
 `POST`	https://moneyz-kelompok6.herokuapp.com/api/register

Parameter
```
{
    "username": "fordocumnentation",
    "password": "fordocumentation123",
    "email": "fordocumentation@gmail.com",
    "phone": "08123456789"
}
```
Respon

![regis2](https://user-images.githubusercontent.com/90240714/165982063-e94005bf-8ea5-4a82-a53c-b5245a743d1f.JPG)


### login

* Method : `POST`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/login
* Autentikasi : -
* Parameter

| Parameter | Description |  
| ----------- | ----------- | 
| phone | Berupa nomor hp yang sudah terdaftar saat register |
| password | Berupa string yang sudah terdaftar saat register |

* Contoh 1

Contoh 1
`POST`		https://moneyz-kelompok6.herokuapp.com/api/login

Parameter
```
{
    "phone": "08123456789",
    "password": "fordocumentation123"
}
```
Respon

![login1](https://user-images.githubusercontent.com/90240714/165982275-c52a4811-588a-4046-b1fc-037e756f84c8.JPG)


* Contoh 2

`POST` 	https://moneyz-kelompok6.herokuapp.com/api/login

Parameter
```
{
    "username": "08123456789",
    "password": "tesdokumentasi1234"
}
```

Respon

![login2](https://user-images.githubusercontent.com/90240714/165982407-b1c271fb-32e3-43bc-b170-6b4df59905d7.JPG)


### getalluser

* Method : `GET`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/admin/
* Autentikasi : Admin
* Parameter : -

* Contoh 1

`GET`		https://moneyz-kelompok6.herokuapp.com/api/admin/

Respon

![getalluser1](https://user-images.githubusercontent.com/90240714/165982772-cda11e0c-52c1-4737-9cb4-128690bedcbe.JPG)

* Contoh 2 (menggunakan autentikasi user)

`GET`		https://moneyz-kelompok6.herokuapp.com/api/admin/

Respon

![getalluser2](https://user-images.githubusercontent.com/90240714/165983187-5c8961f5-7a46-41f9-b62e-5c4309c88f37.JPG)


### topup

* Method : `POST`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/admin/topup
* Autentikasi : Admin
* Parameter

| Parameter | Description | 
| ----------- | ----------- | 
| phone_user | Berupa nomor hp user yang akan ditambahkan saldonya | 
| nominal | Berupa jumlah uang yang akan ditambahkan ke akun MoneyZ user|

* Contoh 1

`POST`		https://moneyz-kelompok6.herokuapp.com/api/admin/topup

Parameter
```
{
    "phone_user": "08123456789",
    "nominal": "20000"
}
```

Respon

![topup1](https://user-images.githubusercontent.com/90240714/165984093-0a755980-9245-43b1-b7e9-6bbbc96dce5d.JPG)


* Contoh 2 (menggunakan autentikasi user)

`POST`		https://moneyz-kelompok6.herokuapp.com/api/admin/topup

Parameter
```
{
    "phone_user": "08123456789",
    "nominal": "20000"
}
```

Respon

![topup2](https://user-images.githubusercontent.com/90240714/165984283-b23fe40d-c5e7-47c5-b2b9-999431317d9c.JPG)


### transfer

* Method : `POST`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/user/transfer
* Autentikasi : User
* Parameter

| Parameter | Description | 
| ----------- | ----------- | 
| nomortujuan | Berupa nomor hp tujuan yang menjadi identitas dari data terkait. Perlu diisi apabila ingin melakukan pengiriman uang | 
| nominal | Berupa jumlah uang yang akan ditransfer ke akun MoneyZ user | 

* Contoh 1

`POST`		https://moneyz-kelompok6.herokuapp.com/api/user/transfer

Parameter
```
{
    "nomortujuan": "089173612931",
    "nominal": "10000"
}
```
Respon

![transfer1](https://user-images.githubusercontent.com/90240714/165984565-afea11b1-685b-48af-8394-5b565963ab57.JPG)


* Contoh 2 (jika saldo tidak mencukupi)

`POST` 	https://moneyz-kelompok6.herokuapp.com/api/user/transfer

Parameter
```
{
    "nomortujuan": "089173612931",
    "nominal": "20000"
}
```

Respon

![transfer2](https://user-images.githubusercontent.com/90240714/165984762-8768de00-e05c-4b41-977f-e6cf10948a35.JPG)


### balance

* Method : `GET`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/user/balance
* Autentikasi : User
* Parameter : -


* Contoh

`GET`		https://moneyz-kelompok6.herokuapp.com/api/user/balance

Respon

![balance1](https://user-images.githubusercontent.com/90240714/165985054-68bdf0c5-e4cb-4f36-8852-3078a9a25916.JPG)


### history

* Method : `GET`
* Alamat URL : https://moneyz-kelompok6.herokuapp.com/api/user/history
* Autentikasi : User
* Parameter : -

* Contoh

`GET`		https://moneyz-kelompok6.herokuapp.com/api/user/history

Respon

![history](https://user-images.githubusercontent.com/90240714/165985714-93cc61db-bbfe-4912-9bff-1eaf1e7817b8.JPG)



e-money-kelompok-6 created by GitHub Classroom
