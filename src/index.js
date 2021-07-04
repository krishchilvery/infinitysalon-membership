import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider as AlertProvider, positions, transitions } from "react-alert";
import AlertTemplate from "./components/AlertTemplate";
import AuthProvider from "./components/AuthModal";

const alertOptions = {
  position: positions.TOP_RIGHT,
  offset: "30px",
  timeout: 3000,
  transition: transitions.SCALE,
  type: "info",
};

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
