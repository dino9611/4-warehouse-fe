import React, { useEffect, useRef, useState } from "react";
import "./styles/product.css";
import CardProduct from "./../../components/CardProduct";
import { debounce } from "throttle-debounce";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { API_URL } from "./../../constants/api.js";
import images from "./../../assets";
import { useTransition, animated } from "react-spring";
import ClickOutside from "../../helpers/ClickOutside";
import { Link } from "react-router-dom";

function Product() {
  // Product
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalProduct, setTotalProduct] = useState(null);
  // Filter & Sort
  const [name, setName] = useState("");
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [category, setCategory] = useState([]);
  const [joinCategory, setJoinCategory] = useState("");
  const [sort, setSort] = useState("");
  const [sortName, setSortName] = useState("Urutkan");

  const [handleSort, setHandleSort] = useState(false);
  const ref = useRef();

  ClickOutside(ref, () => setHandleSort(false));

  const transition = useTransition(handleSort, {
    config: { mass: 1, tension: 500, friction: 60, clamp: true },
    from: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
    enter: { x: 0, y: 0, opacity: 1, PointerEvent: "all" },
    leave: { x: 0, y: -10, opacity: 0, PointerEvent: "none" },
  });

  // Tes
  const [isChecked, setIsChecked] = useState(false);
  console.log(dataProduct);
  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/product/category`);

        setDataCategory(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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

        let res = await axios.get(`${queryUrl}`);

        setTotalProduct(res.headers["x-total-count"]);

        setDataProduct(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [page, limit, name, priceMin, priceMax, sort, joinCategory]);

  useEffect(() => {
    let join = category.join(" ");
    setJoinCategory(join);
  }, [category]);

  const onChangeHandlerCategory = (e) => {
    if (e.target.checked) {
      setCategory([...category, parseInt(e.target.value)]);
    } else {
      setCategory(category.filter((el) => el != e.target.value));
    }
  };

  const onChangePage = (e, value) => {
    setPage(value);
  };

  const onClickSort = (e) => {
    setSort(e.target.id);
    setSortName(e.target.innerHTML);
    setHandleSort(false);
  };

  const renderFilterCategory = () => {
    return dataCategory.map((el, index) => {
      return (
        <div key={index}>
          <label
            className="product-category-label d-flex align-items-center"
            for={el.category}
            style={{ cursor: "pointer" }}
          >
            <input
              type="checkbox"
              id={el.category}
              name={el.category}
              value={el.id}
              className=" mr-2"
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

  const renderSort = () => {
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
        {/* {handleSort ? renderContentSort() : null} */}
        {transition((style, item) =>
          item ? (
            <animated.div
              ref={ref}
              style={style}
              className="product-sort-list w-100"
            >
              <div
                id="nameasc"
                onClick={onClickSort}
                className="product-sort-sub"
              >
                Nama A-Z
              </div>
              <div
                id="namedesc"
                onClick={onClickSort}
                className="product-sort-sub"
              >
                Nama Z-A
              </div>
              <div
                id="priceasc"
                onClick={onClickSort}
                className="product-sort-sub"
              >
                Harga terendah
              </div>
              <div
                id="pricedesc"
                onClick={onClickSort}
                className="product-sort-sub"
              >
                Harga tertinggi
              </div>
            </animated.div>
          ) : null
        )}
      </div>
    );
  };

  const renderProduct = () => {
    return dataProduct.map((el, index) => {
      return (
        <div key={index} className="product-card">
          <Link
            className="text-link"
            to={{
              pathname: `/products/${el.id}`,
              state: el,
            }}
          >
            <CardProduct
              img={`${API_URL}/${el.images[0]}`}
              category={
                el.category.charAt(0).toUpperCase() + el.category.slice(1)
              }
              title={`${el.name.charAt(0).toUpperCase() + el.name.slice(1)} ${
                el.weight
              }`}
              price={el.price}
              btn="Beli"
            />
          </Link>
        </div>
      );
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-between">
        <div className="product-sidebar mr-3">
          <div className="product-sidebar-wrapper w-100 mb-2">
            <div className="product-sidebar-title d-flex align-items-center justify-content-between">
              <div className="product-title-name">Urut berdasarkan</div>
              <div
                className="product-title-reset"
                onClick={() => {
                  setSort("");
                  setSortName("Urutkan");
                }}
              >
                Reset
              </div>
            </div>
            <div className="product-sort-content d-flex justify-content-center">
              {renderSort()}
            </div>
          </div>
          <div className="product-sidebar-wrapper w-100">
            <div className="product-sidebar-title d-flex align-items-center justify-content-between">
              <div className="product-title-name">Filter</div>
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
              {renderFilterCategory()}
              <div className="product-border my-3"></div>
              <div>
                <div className="product-title-name">Price</div>
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
                    onChange={debounce(1000, (e) =>
                      setPriceMin(e.target.value)
                    )}
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
                    onChange={debounce(1000, (e) =>
                      setPriceMax(e.target.value)
                    )}
                    className="product-input-price w-100"
                  />
                </div>
              </div>
              <div className="product-border my-3"></div>
              <div>
                <div className="product-title-name ">Lokasi Pengiriman</div>
                <div className="product-address my-2">
                  Kembangan, Jakarta Barat, DKI JAKARTA
                </div>
                <div className="d-flex align-items-center">
                  <div className="product-change-address mr-1">Ubah</div>
                  <div>
                    <img src={images.point} alt="" />
                  </div>
                </div>
              </div>
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
              <input
                type="text"
                placeholder="Cari produk"
                onChange={debounce(1000, (e) => setName(e.target.value))}
                className="product-filter-nama w-100"
              />
              <img src={images.searchpolos} alt="" />
            </div>
          </div>
          <div className="product-list-wrapper">{renderProduct()}</div>
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
