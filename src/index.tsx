import "bulma/css/bulma.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./firebase/config";
import "./index.css";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";

const container = document.getElementById("root") as Element | DocumentFragment;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();
