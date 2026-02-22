import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Diagnostic Logging for Blank Page
window.addEventListener("error", (event) => {
    console.error("Global JS Error caught in main.tsx:", event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled Promise Rejection caught in main.tsx:", event.reason);
});

console.log("Application initializing...");

const rootElement = document.getElementById("root");
if (!rootElement) {
    console.error("Failed to find root element with id 'root'");
} else {
    createRoot(rootElement).render(<App />);
}
