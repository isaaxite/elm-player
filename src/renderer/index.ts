import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";

async function main() {
  createRoot(document.getElementById('app') as HTMLElement).render(React.createElement(App));
}

main();
