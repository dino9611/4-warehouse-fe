import React, { useEffect, useState } from "react";
import "./styles/product.css";
import CardProduct from "./../../components/CardProduct";
import { debounce } from "throttle-debounce";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { API_URL } from "./../../constants/api.js";
import images from "./../../assets";

function Product() {
  // Product
  const [dataProduct, setDataProduct] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalProduct, setTotalProduct] = useState(null);
  // Filter & Sort
  const [name, setName] = useState("");
  const [priceMin, setPriceMin] = useState(null);
  const [priceMax, setPriceMax] = useState(null);
  const [category, setCategory] = useState([]);
  const [joinCategory, setJoinCategory] = useState("");
  const [sort, setSort] = useState("");

  // Tes
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let res = await axios.get(`${API_URL}/product/list-category`);

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

  const renderFilterCategory = () => {
    return dataCategory.map((el, index) => {
      return (
        <div key={index}>
          <label className="d-flex align-items-center" for={el.category}>
            <input
              type="checkbox"
              id={el.category}
              name={el.category}
              value={el.id}
              className="mr-2"
              onChange={onChangeHandlerCategory}
            />
            {el.category.charAt(0).toUpperCase() + el.category.slice(1)}
          </label>
        </div>
      );
    });
  };

  const renderProduct = () => {
    return dataProduct.map((el, index) => {
      return (
        <div key={index} className="product-card">
          <CardProduct
            img={el.image}
            category={
              el.category.charAt(0).toUpperCase() + el.category.slice(1)
            }
            title={`${el.name.charAt(0).toUpperCase() + el.name.slice(1)} ${
              el.weight
            }`}
            price={el.price}
            btn="Beli"
          />
        </div>
      );
    });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="product-sidebar">
          <div className="product-sidebar-wrapper w-100 mb-2">
            <div className="product-sidebar-title d-flex align-items-center justify-content-between">
              <div className="product-title-name">Urut berdasarkan</div>
              <div className="product-title-reset">Reset</div>
            </div>
            <div className="product-sort-content d-flex justify-content-center">
              <select className="product-content-select w-100">
                <option value="">asdasdasd</option>
              </select>
            </div>
          </div>
          <div className="product-sidebar-wrapper w-100">
            <div className="product-sidebar-title d-flex align-items-center justify-content-between">
              <div className="product-title-name">Filter</div>
              <div className="product-title-reset">Reset</div>
            </div>
            <div className="product-sort-content">
              <div className="product-checkbox d-flex align-items-center">
                <input
                  type="checkbox"
                  id="myCheck"
                  className="product-checkmark"
                  onChange={() => setIsChecked(1)}
                />
                {isChecked === 1 ? (
                  <img src={images.checked} alt="" />
                ) : (
                  <img src={images.uncheck} alt="" />
                )}
              </div>
              <div className="product-checkbox d-flex align-items-center">
                <input
                  type="checkbox"
                  id="myCheck"
                  className="product-checkmark"
                  onChange={() => setIsChecked(2)}
                />
                {isChecked === 2 ? (
                  <img src={images.checked} alt="" />
                ) : (
                  <img src={images.uncheck} alt="" />
                )}
              </div>
              <div className="product-checkbox d-flex align-items-center">
                <input
                  type="checkbox"
                  id="myCheck"
                  className="product-checkmark"
                  onChange={() => setIsChecked(3)}
                />
                {isChecked === 3 ? (
                  <img src={images.checked} alt="" />
                ) : (
                  <img src={images.uncheck} alt="" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-3">
          <div className="product-filter-font mb-3">Filter</div>
          <div className="product-filter-container p-3">
            <div className="d-flex flex-column">
              <div className="product-filter-by mb-3">Kategori</div>
              <div>
                <div className="product-category-content d-flex flex-column">
                  {renderFilterCategory()}
                </div>
              </div>
            </div>
            <div className="product-border my-2"></div>
            <div className="d-flex flex-column">
              <div className="product-filter-by mb-3">Harga</div>
              <div className="mb-2">
                <input
                  type="number"
                  placeholder="Harga Minimum"
                  onChange={debounce(1000, (e) => setPriceMin(e.target.value))}
                  className="product-filter-harga"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Harga Maksimum"
                  onChange={debounce(1000, (e) => setPriceMax(e.target.value))}
                  className="product-filter-harga"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="d-flex">
            <input
              type="text"
              placeholder="Cari nama"
              onChange={debounce(1000, (e) => setName(e.target.value))}
              className="product-filter-nama w-100"
            />
            <div className="d-flex align-items-center mx-2">
              <select
                placeholder="select option"
                className="product-sort"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="" hidden>
                  Urutkan
                </option>
                <option value="">Urutkan</option>
                <option value="nameasc">A-Z</option>
                <option value="namedesc">Z-A</option>
                <option value="pricedesc">Harga Tertinggi</option>
                <option value="priceasc">Harga Terendah</option>
              </select>
            </div>
          </div>
          <div className="product-list-wrapper mt-5">{renderProduct()}</div>
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
