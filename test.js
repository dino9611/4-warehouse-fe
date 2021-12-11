// let test = JSON.stringify(["/assets/produk/produk1", "/assets/produk/produk2", "/assets/produk/produk3"]);
// console.log(test);

// let x = ["/assets/produk/produk1", "/assets/produk/produk2", "/assets/produk/produk3"]
// let y = JSON.stringify(x[0]);
// console.log(y);

{/* <img src= */}

// Di BE parsing json.parse

// ! Get data warehouse, semua ada berapa, yg di state simpennya pake array of object
    // Get nama gudang sama id aja
    // let x = {
    //     id: "",
    //     namaGudang: "",
    //     stock: 0,
    // }
    // ! Di backend dapet data id & nama gudang, dapet array of object kemudian sblm taro setState, di looping dlu buat nambahin si stok 0
    // ! val.stock = 0 --> setState stlh di-looping

    // let y = [{
    //         id: "",
    //         gudang: "",
    //     },
    //     {
    //         id: "",
    //         gudang: "",
    //     }
    // ]

    // y.forEach((val) => {
    //     val.stock = 0;
    // })

// let y = [{
//     id: "",
//     gudang: "",
// },
// {
//     id: "",
//     gudang: "",
// }
// ]

// y.forEach((val) => {
// val.stock = 0;
// })

// console.log(y);

// console.log(typeof(--1));

// console.log(typeof("-"));

// let x = ["", "", ""];

// x.forEach((val) => {
//     console.log(Boolean(val));
// })

// let z = "Bambang Sutedjo"

// console.log(z.length);

// const thousandSeparator = (value) => {
//     let pattern = /(\d)(?=(\d{3})+(?!\d))/g;
//     let replacement = "\$1,";
//     let stringConvert = String(value);
//     return stringConvert.replace(pattern, replacement);
//   };

// let xx = thousandSeparator(10000);
// console.log(parseInt(xx));

let zzz = "Kacang-Kacangan";
console.log(zzz.toLowerCase().replace(/-/g, '_'));