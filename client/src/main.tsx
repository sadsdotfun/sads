import { createRoot } from "react-dom/client";
import { PrivyWrapper } from "./lib/privy";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <PrivyWrapper>
    <App />
  </PrivyWrapper>
);
