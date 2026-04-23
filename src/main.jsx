import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const rootEl = document.getElementById("root");

function showFatalError(error) {
  if (!rootEl) return;
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  rootEl.innerHTML = `
    <div style="min-height:100vh;background:#0c0b09;color:#ede8dc;font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans','Yu Gothic',sans-serif;padding:24px;display:flex;align-items:center;justify-content:center;">
      <div style="max-width:720px;width:100%;background:#1a1812;border:1px solid #352f22;border-radius:16px;padding:20px;box-shadow:0 0 24px rgba(240,165,0,0.12);">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#f0a500;margin-bottom:10px;">Runtime Error</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:12px;">アプリの読み込みでエラーが発生しました</div>
        <pre style="white-space:pre-wrap;word-break:break-word;background:#0f0d08;border:1px solid #28241a;border-radius:12px;padding:14px;color:#ede8dc;overflow:auto;">${message}</pre>
      </div>
    </div>
  `;
}

window.addEventListener("error", (event) => {
  showFatalError(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showFatalError(event.reason);
});

try {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  showFatalError(error);
}
