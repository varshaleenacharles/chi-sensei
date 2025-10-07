import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./utils/testAuth"; // Import test utilities for debugging

createRoot(document.getElementById("root")!).render(<App />);
