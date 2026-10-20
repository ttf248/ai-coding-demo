import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("缺少 #root 挂载点");

ReactDOM.createRoot(container).render(<App />);
