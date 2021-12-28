import React from "react";
import "./styles/homepage.css";
import Header from "../../components/Header";
import Carousel from "./../../components/Carousel";
import CardCategory from "../../components/CardCategory";
import CardProduct from "../../components/CardProduct";
import CarouselCard from "../../components/CarouselCard";
import CarouselProduct from "../../components/CarouselProduct";
import Footer from "../../components/Footer";
import images from "./../../assets";

const {
  produk1,
  buah,
  coklat,
  kacang,
  kopi,
  rempah,
  sayur,
  susu,
  teh,
  footer,
  facebook,
  instagram,
  wa,
  call,
} = images;

function Homepage() {
  return (
    <div>
      <div className="homepage-carousel w-100">
        <div className="homepage-carousel-wrapper">
          <Carousel />
        </div>
      </div>
      <div className="container mt-4">
        <div className="row">
          <h4 className="homepage-text-category">
            Temukan produk dari kategori
          </h4>
        </div>
        <div className="row d-flex justify-content-between mt-3">
          <CardCategory img={kopi} name="Kopi" />
          <CardCategory img={teh} name="Teh" />
          <CardCategory img={susu} name="Susu" />
          <CardCategory img={coklat} name="Coklat" />
          <CardCategory img={rempah} name="Rempah" />
          <CardCategory img={sayur} name="Sayur" />
          <CardCategory img={buah} name="Buah" />
          <CardCategory img={kacang} name="Kacang" />
        </div>
      </div>
      <div className="mt-5">
        <div className="homepage-diskon">
          <div className="container">
            <div className="row ">
              <h5
                className="mt-4 mb-3"
                style={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}
              >
                Kejar diskon spesial!
              </h5>
            </div>
          </div>
          <div>
            <CarouselCard>
              <div className=""></div>
              <div className="">
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div className="">
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
              <div>
                <CardProduct
                  img={produk1}
                  category="Kacang"
                  title="Kacang almond panggang kupas 2kg"
                  discount="212.000"
                  price="105.000"
                  btn="Beli"
                />
              </div>
            </CarouselCard>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="container">
          <div className="row ">
            <h5
              className="mb-3"
              style={{ fontSize: "20px", fontWeight: "600", color: "#070707" }}
            >
              Jelajahi produk kami
            </h5>
          </div>
          <div>
            <div>
              <div className>
                <CarouselProduct>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                  <div>
                    <CardProduct
                      img={produk1}
                      category="Kacang"
                      title="Kacang almond panggang kupas 2kg"
                      discount="212.000"
                      price="105.000"
                      btn="Beli"
                    />
                  </div>
                </CarouselProduct>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
