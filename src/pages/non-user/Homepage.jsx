import React, { useState } from "react";
import "./styles/homepage.css";
import CarouselBanner from "../../components/CarouselBanner";
import CardCategory from "../../components/CardCategory";
import CardProduct from "../../components/CardProduct";
import CarouselProduct from "../../components/CarouselProduct";
import TitleCategory from "../../components/TitleCategory";
import images from "./../../assets";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "./../../constants/api.js";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import SkeletonCardProduct from "../../components/SkeletonCardProduct";
import SkeletonCardCategory from "../../components/SkeletonCardCategory";

const { produk1, buah, coklat, kacang, kopi, rempah, sayur, susu, teh } =
  images;

const categoryImg = [kopi, teh, susu, coklat, rempah, sayur, buah, kacang];

function Homepage() {
  //STATE

  //DATA STATE
  const [dataCategory, setDataCategory] = useState([]);
  const [dataHotProduct, setDataHotProduct] = useState([]);
  const [dataProductSusu, setDataProductSusu] = useState([]);
  const [dataProductBuah, setDataProductBuah] = useState([]);
  const [dataProductBumbu, setDataProductBumbu] = useState([]);
  const [dataProductCoklat, setDataProductCoklat] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  const carouselData = useSelector((state) => state.carouselReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        setLoadingPage(true);

        let res = await axios.get(`${API_URL}/product/category`);

        let resHotProduct = await axios.get(
          `${API_URL}/product/get/hot-product`
        );

        let resProductSusu = await axios.get(
          `${API_URL}/product/get/product-category/3?limit=10`
        );

        let resProductBuah = await axios.get(
          `${API_URL}/product/get/product-category/7?limit=10`
        );

        let resProductBumbu = await axios.get(
          `${API_URL}/product/get/product-category/5?limit=10`
        );

        let resProductCoklat = await axios.get(
          `${API_URL}/product/get/product-category/4?limit=10`
        );

        setDataProductSusu(resProductSusu.data);
        setDataProductBuah(resProductBuah.data);
        setDataProductBumbu(resProductBumbu.data);
        setDataProductCoklat(resProductCoklat.data);
        setDataHotProduct(resHotProduct.data);
        setDataCategory(res.data);

        dispatch({ type: "RESETCAROUSEL" });

        setLoadingPage(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // RENDER LIST CATEGORY
  const renderListCategory = () => {
    return dataCategory.map((el, index) => (
      <CardCategory img={categoryImg[index]} name={el.category} />
    ));
  };

  // RENDER LIST SKELETON CATEGORY
  const renderListSkeletonCategory = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((el, index) => (
      <SkeletonCardCategory key={index} />
    ));
  };

  // RENDER LIST HOT ITEMS
  const renderHotProductList = () => {
    return dataHotProduct.map((el, index) => {
      return (
        <CardProduct
          key={index}
          img={`${API_URL}/${el.images[0]}`}
          category={el.category}
          title={el.name}
          price={el.price}
          total_stock={parseInt(el.total_stock)}
          data={el}
        />
      );
    });
  };

  //RENDER HOT ITEMS
  const renderHotProduct = () => {
    return (
      <div className=" container mt-3">
        <div className="row align-items-center justify-content-between">
          {loadingPage ? renderSkeletonHotItems() : renderHotProductList()}
        </div>
      </div>
    );
  };

  // RENDER SKELETON HOT ITEMS
  const renderSkeletonHotItems = () => {
    return [1, 2, 3, 4, 5].map((el, index) => <SkeletonCardProduct />);
  };

  // RENDER SKELETON PRODUCT BY CATEGORY
  const renderSkeletonByCategory = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el, index) => (
      <SkeletonCardProduct />
    ));
  };

  // RENDER PRODUCT SUSU
  const renderDataProductSusu = () => {
    return dataProductSusu.map((el, index) => {
      return (
        <div className="p-2">
          <CardProduct
            key={index}
            img={`${API_URL}/${el.images[0]}`}
            category={el.category}
            title={el.name}
            price={el.price}
            total_stock={parseInt(el.total_stock)}
            data={el}
          />
        </div>
      );
    });
  };

  // RENDER CAROUSEL PRODUCT SUSU
  const renderCarouselProductSusu = () => {
    return (
      <div className="row mb-5">
        <div className="homepage-carousel-product col-12 p-0">
          <CarouselProduct cat="carousel-susu">
            <div></div>
            {loadingPage ? renderSkeletonByCategory() : renderDataProductSusu()}
          </CarouselProduct>
          <TitleCategory
            cat="carousel-susu"
            img={images.susu}
            bgColor="#70beea"
            index={carouselData.indexSusu}
            refCat={carouselData.refSusu}
          >
            Minuman untuk temani waktu luangmu!
          </TitleCategory>
        </div>
      </div>
    );
  };

  // RENDER DATA LIST PRODUCT BUAH
  const renderDataProductBuah = () => {
    return dataProductBuah.map((el, index) => {
      return (
        <div className="p-2">
          <CardProduct
            key={index}
            img={`${API_URL}/${el.images[0]}`}
            category={el.category}
            title={el.name}
            price={el.price}
            total_stock={parseInt(el.total_stock)}
            data={el}
          />
        </div>
      );
    });
  };

  // RENDER CAROUSEL PRODUCT BUAH
  const renderCarouselProductBuah = () => {
    return (
      <div className="row mb-5">
        <div className="homepage-carousel-product col-12 p-0">
          <CarouselProduct cat="carousel-buah">
            <div></div>
            {loadingPage ? renderSkeletonByCategory() : renderDataProductBuah()}
          </CarouselProduct>
          <TitleCategory
            cat="carousel-buah"
            img={images.buah}
            bgColor="#9abf31"
            index={carouselData.indexBuah}
            refCat={carouselData.refBuah}
          >
            Buah segar untuk anda yang ingin hidup sehat!
          </TitleCategory>
        </div>
      </div>
    );
  };

  // RENDER DATA LIST PRODUCT BUMBU
  const renderDataProductBumbu = () => {
    return dataProductBumbu.map((el, index) => {
      return (
        <div className="p-2">
          <CardProduct
            key={index}
            img={`${API_URL}/${el.images[0]}`}
            category={el.category}
            title={el.name}
            price={el.price}
            total_stock={parseInt(el.total_stock)}
            data={el}
          />
        </div>
      );
    });
  };

  // RENDER CAROUSEL PRODUCT BUMBU
  const renderCarouselProductBumbu = () => {
    return (
      <div className="row mb-5">
        <div className="homepage-carousel-product col-12 p-0">
          <CarouselProduct cat="carousel-bumbu">
            <div></div>
            {loadingPage
              ? renderSkeletonByCategory()
              : renderDataProductBumbu()}
          </CarouselProduct>
          <TitleCategory
            cat="carousel-bumbu"
            img={images.rempah}
            bgColor="#c2854c"
            index={carouselData.indexBumbu}
            refCat={carouselData.refBumbu}
          >
            Masak dengan bumbu dan rempah pilihan!
          </TitleCategory>
        </div>
      </div>
    );
  };

  // RENDER DATA LIST PRODUCT COKLAT
  const renderDataProductCoklat = () => {
    return dataProductCoklat.map((el, index) => {
      return (
        <div className="p-2">
          <CardProduct
            key={index}
            img={`${API_URL}/${el.images[0]}`}
            category={el.category}
            title={el.name}
            price={el.price}
            total_stock={parseInt(el.total_stock)}
            data={el}
          />
        </div>
      );
    });
  };

  // RENDER CAROUSEL PRODUCT COKLAT
  const renderCarouselProductCoklat = () => {
    return (
      <div className="row mb-5">
        <div className="homepage-carousel-product col-12 p-0">
          <CarouselProduct cat="carousel-coklat">
            <div></div>
            {loadingPage
              ? renderSkeletonByCategory()
              : renderDataProductCoklat()}
          </CarouselProduct>
          <TitleCategory
            cat="carousel-coklat"
            img={images.coklat}
            bgColor="#813f2c"
            index={carouselData.indexCoklat}
            refCat={carouselData.refCoklat}
          >
            Nyemil coklat lezat dan sehat!
          </TitleCategory>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="homepage-carousel w-100 mt-4">
        <div className="homepage-carousel-wrapper w-100 h-100">
          <CarouselBanner />
        </div>
      </div>
      <div className="container mt-4">
        <div className="row">
          <h4 className="homepage-text-category">
            Temukan Produk dari Kategori
          </h4>
        </div>
        <div className="row d-flex justify-content-between mt-3">
          {loadingPage ? renderListSkeletonCategory() : renderListCategory()}
        </div>
      </div>
      <div className="mt-5">
        <div className="homepage-diskon p-4">
          <div className="container">
            <div className="row">
              <h5
                style={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}
              >
                Produk Terlaris Kami
              </h5>
            </div>
          </div>
          {renderHotProduct()}
        </div>
      </div>
      <div className="container mt-5">
        <div className="row mb-3">
          <h5
            className="mb-3"
            style={{ fontSize: "20px", fontWeight: "600", color: "#070707" }}
          >
            Jelajahi Produk Kami
          </h5>
        </div>
        {renderCarouselProductSusu()}
        {renderCarouselProductBuah()}
        {renderCarouselProductBumbu()}
        {renderCarouselProductCoklat()}
      </div>
    </div>
  );
}

export default Homepage;
