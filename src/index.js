import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";

import App from "./components/App";
import "antd/dist/antd.css";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
