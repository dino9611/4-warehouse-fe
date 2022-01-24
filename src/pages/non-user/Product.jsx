import React, { useEffect, useRef, useState } from "react";

// REACT LIBRARY
import { useTransition, animated } from "react-spring";
import { debounce } from "throttle-debounce";
import { Link } from "react-router-dom";
import axios from "axios";

// MUI
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Breadcrumbs from "@mui/material/Breadcrumbs";

// COMPONENTS
import SkeletonCardProduct from "../../components/SkeletonCardProduct";
import CardProduct from "./../../components/CardProduct";
import ClickOutside from "../../helpers/ClickOutside";
import { API_URL } from "./../../constants/api.js";
import Pagination from "@mui/material/Pagination";
import images from "./../../assets";
import assets from "./../../assets";
import "./styles/product.css";

// BREADCRUMB ARRAY
const breadcrumbs = [
  <Link to="/" className="text-link">
    <div className="detailed-product-breadcrumb">Home</div>
  </Link>,
  <Link to="/products" className="text-link">
    <div className="detailed-product-breadcrumb">Semua Product</div>
  </Link>,
  ,
];

function Product() {
  // DATA STATE
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // PAGINATION STATE
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(16);
  const [totalProduct, setTotalProduct] = useState(null);

  // FILTER N SORT STATE
  const [name, setName] = useState("");
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [category, setCategory] = useState([]);
  const [joinCategory, setJoinCategory] = useState("");
  const [sort, setSort] = useState("nameasc");
  const [sortName, setSortName] = useState("Nama A-Z");
  const [handleSort, setHandleSort] = useState(false);
  const ref = useRef();

  ClickOutside(ref, () => setHandleSort(false));

  // TRANSITION DROPDOWN SORT
  const transition = useTransition(handleSort, {
    config: { mass: 1, tension: 500, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });

  // USE EFFECT UNTUK GET DATA CATEGORY
  useEffect(() => {
    (async () => {
      try {
        setLoadingCategory(true);

        let res = await axios.get(`${API_URL}/product/category`);

        setDataCategory(res.data);

        setLoadingCategory(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // USEEFFECT UNTUK GET DATA LIST PRODUCT
  useEffect(() => {
    (async () => {
      try {
        let queryUrl = `${API_URL}/product?page=${page - 1}&limit=${limit}`;

        if (name) {
          queryUrl += `&name=${name}`;
        }
        if (priceMin) {
          queryUrl += `&pricemin=${priceMin}`;
        }
        if (priceMax) {
          queryUrl += `&pricemax=${priceMax}`;
        }
        if (sort) {
          queryUrl += `&sort=${sort}`;
        }
        if (joinCategory) {
          queryUrl += `&category=${joinCategory}`;
        }

        setLoadingData(true);

        let res = await axios.get(`${queryUrl}`);

        setTotalProduct(res.headers["x-total-count"]);

        setDataProduct(res.data);
        setLoadingData(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page, limit, name, priceMin, priceMax, sort, joinCategory]);

  // USEEFFECT UNTUK JOIN FILTER CATEGORY
  useEffect(() => {
    let join = category.join(" ");
    setJoinCategory(join);
  }, [category]);

  // USEEFFECT UNTUK SET PAGE KE 1 SETELAH FILTERING ATAU SORTING
  useEffect(() => {
    setPage(1);
  }, [name, priceMin, priceMax, sort, joinCategory]);

  // EVENT

  // ONCANGE FILTER CATEGORY
  const onChangeHandlerCategory = (e) => {
    if (e.target.checked) {
      setCategory([...category, parseInt(e.target.value)]);
    } else {
      setCategory(category.filter((el) => el != e.target.value));
    }
  };

  // ONCHANGE PAGE
  const onChangePage = (e, value) => {
    setPage(value);
  };

  //ONCHANGE SORTING
  const onClickSort = (e) => {
    setSort(e.target.id);
    setSortName(e.target.innerHTML);
    setHandleSort(false);
  };

  // RENDERING

  // RENDER BRADCRUMBS
  const renderBreadcrumbs = () => {
    return (
      <div className="mt-3 mb-4">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="10" />}
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
    );
  };

  //RENDER FILTER KATEGORI
  const renderFilterCategory = () => {
    return dataCategory.map((el, index) => {
      return (
        <div key={index}>
          <label
            className="product-category-label d-flex align-items-center"
            htmlFor={el.category}
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              id={el.category}
              name={el.category}
              value={el.id}
              className="mr-2"
              onChange={onChangeHandlerCategory}
              style={{ opacity: "0", cursor: "pointer", zIndex: "999" }}
            />
            {category.find((element) => element === el.id) ? (
              <img
                src={images.checked}
                alt="checked"
                style={{ position: "absolute" }}
              />
            ) : (
              <img
                src={images.unchecked}
                alt="unchecked"
                style={{ position: "absolute" }}
              />
            )}

            {el.category.charAt(0).toUpperCase() + el.category.slice(1)}
          </label>
        </div>
      );
    });
  };

  // RENDER SORTING
  const renderSort = () => {
    const sortArr = [
      {
        id: "nameasc",
        name: "Nama A-Z",
      },
      {
        id: "namedesc",
        name: "Nama Z-A",
      },
      {
        id: "priceasc",
        name: "Harga terendah",
      },
      {
        id: "pricedesc",
        name: "Harga tertinggi",
      },
    ];

    return (
      <div
        className="product-content-select w-100 "
        style={{ position: "relative" }}
        onClick={() => setHandleSort(!handleSort)}
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          <div style={{ fontSize: "0.875em" }}>{sortName}</div>
          <img src={images.arrowdropdown} alt="" />
        </div>
        {transition((style, item) =>
          item ? (
            <animated.div style={style} className="product-sort-list w-100">
              {sortArr.map((el, index) => {
                return (
                  <div
                    key={index}
                    id={el.id}
                    onClick={onClickSort}
                    className={`product-sort-sub d-flex align-items-center justify-content-between ${
                      sort === el.id ? "product-sort-sub-active" : null
                    }`}
                  >
                    {el.name}
                    {sort === el.id ? (
                      <div>
                        <img src={assets.centangsort} alt="centang" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </animated.div>
          ) : null
        )}
      </div>
    );
  };

  // RENDER LIST PRODUK

  const renderProduct = () => {
    return dataProduct.map((el, index) => {
      return (
        <div key={index} className="product-card">
          <CardProduct
            img={`${API_URL}/${el.images[0]}`}
            category={
              el.category.charAt(0).toUpperCase() + el.category.slice(1)
            }
            title={`${el.name.charAt(0).toUpperCase() + el.name.slice(1)}`}
            price={el.price}
            total_stock={parseInt(el.total_stock)}
            data={el}
          />
        </div>
      );
    });
  };

  // RENDER PRICE FILTER
  const renderPriceFilter = () => {
    return (
      <div>
        <div className="product-title-name" style={{ color: "#5a5a5a" }}>
          Price
        </div>
        <div className="product-price-wrapper d-flex align-items-center my-3">
          <div
            className="product-input-price mr-1"
            style={{ color: "#070707" }}
          >
            Rp
          </div>
          <input
            type="number"
            placeholder="Harga Minimum"
            onChange={debounce(1000, (e) => setPriceMin(e.target.value))}
            className="product-input-price w-100"
          />
        </div>
        <div className="product-price-wrapper d-flex align-items-center">
          <div
            className="product-input-price mr-1"
            style={{ color: "#070707" }}
          >
            Rp
          </div>
          <input
            type="number"
            placeholder="Harga maksimum"
            onChange={debounce(1000, (e) => setPriceMax(e.target.value))}
            className="product-input-price w-100"
          />
        </div>
      </div>
    );
  };

  // RENDER SKELETON CARD PRODUK
  const renderSkeletonCard = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((el, index) => {
      return <SkeletonCardProduct />;
    });
  };

  //RENDER SKELETON CATEGORY
  const renderSkeletonCategory = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((el, index) => {
      return (
        <div
          key={index}
          className="d-flex align-items-center mb-2 skeleton-category-anim"
        >
          <div className="skeleton-category-checkbox mr-1"></div>
          <div className="skeleton-category-name"></div>
        </div>
      );
    });
  };

  // RENDER EMPTY PRODUK WHEN FILTERING OR SORTING
  const renderEmptyData = () => {
    return (
      <div className="product-empty-data mt-5">
        <img src={images.error1} alt="error" />
        <div className="w-100 mb-3">Produk yang anda cari tidak ditemukan!</div>
        <div
          style={{ fontWeight: "400", color: "#5a5a5a", fontSize: "0.875em" }}
        >
          Coba kata kunci lain
        </div>
      </div>
    );
  };

  // RETURN

  return (
    <div className="container mt-2">
      <div className="row">{renderBreadcrumbs()}</div>
      <div className="row justify-content-between">
        <div className="product-sidebar mr-3">
          <div className="product-sidebar-wrapper w-100 mb-2">
            <div className="product-sidebar-title d-flex align-items-center justify-content-between">
              <div className="product-title-name d-flex align-items-center">
                <img src={assets.sort} alt="sort" className="mr-2" />
                <div>Urut berdasarkan</div>
              </div>
            </div>
            <div
              className="product-sort-content d-flex justify-content-center"
              ref={ref}
            >
              {renderSort()}
            </div>
          </div>
          <div className="product-sidebar-wrapper w-100">
            <div className="product-sidebar-title d-flex align-items-center justify-content-between">
              <div className="product-title-name d-flex align-items-center">
                <img src={assets.filter} alt="filter" className="mr-2" />
                <div>Filter</div>
              </div>
              <div
                className="product-title-reset"
                onClick={() => {
                  setCategory([]);
                  setJoinCategory("");
                  setPriceMax(null);
                  setPriceMin(null);
                }}
              >
                Reset
              </div>
            </div>
            <div className="product-sort-content">
              {loadingCategory
                ? renderSkeletonCategory()
                : renderFilterCategory()}
              <div className="product-border my-3"></div>
              {renderPriceFilter()}
            </div>
          </div>
        </div>
        <div className="product-content">
          <div className="d-flex justify-content-between align-items-center">
            <div className="product-show-font">
              {`Menampilkan ${
                totalProduct < limit ? totalProduct : limit
              } dari ${totalProduct} produk`}
            </div>
            <div className="product-filter-nama-wrapper d-flex align-items-center">
              <img src={images.searchpolos} alt="" />
              <input
                type="text"
                placeholder="Cari nama produk"
                onChange={debounce(1000, (e) => setName(e.target.value))}
                className="product-filter-nama w-100 ml-2"
              />
            </div>
          </div>

          {loadingData ? (
            <div className="product-list-wrapper">{renderSkeletonCard()} </div>
          ) : !dataProduct.length ? (
            renderEmptyData()
          ) : (
            <div className="product-list-wrapper">{renderProduct()} </div>
          )}
          {/* 
          <div className="product-list-wrapper">
            {loadingData
              ? renderSkeletonCard()
              : !dataProduct.length
              ? renderEmptyData()
              : renderProduct()}
          </div> */}
          <div className="d-flex justify-content-center mt-5">
            <Pagination
              count={Math.ceil(totalProduct / limit)}
              page={page}
              onChange={onChangePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
