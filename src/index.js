import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import Thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import reducers from "./redux/reducers";

ReactDOM.render(
  <Provider store={createStore(reducers, {}, applyMiddleware(Thunk))}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,

  document.getElementById("root")
);
