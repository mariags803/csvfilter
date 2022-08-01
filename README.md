# Code kata: CSV Filter


## Description

Having a CSV file with invoice information, the function validates 
if each invoice meets the business rules:

* Some fields may be empty (two consecutive commas or a final one).

Invoices that do not meet the following rules must be deleted:

* Taxes (IVA and IGIC) are exclusive, only one can be applied.
* The CIF and NIF fields are mutually exclusive, only one of them can be used.
* Invoice number cannot be repeated.
* The net amount must be well calculated. This amount is calculated by 
  applying the corresponding tax on the gross amount

The part of reading the file is omitted to make the implementation easier.

__Example__

``` 
Invoice_number,Invoice_date,Gross_amount,Net_amount,IVA,IGIC,Description,CIF,NIF
1,16/06/2022,1000,790,21,,Asus Laptop,B05539192,
2,03/05/2022,1000,930,,7,Samsung TV,,48628908P

```

## Run project

__Install__

    npm install

__Run test__

    npm test
