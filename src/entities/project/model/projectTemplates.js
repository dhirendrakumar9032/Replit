const indent = (lines) => `${lines.join("\n")}\n`;

function normalizeProjectPackageName(projectName) {
  const normalized = (projectName || "react-playground")
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "react-playground";
}

export function buildProjectPackageJson(projectName, packageDependencies = {}) {
  const userDependencies = Object.entries(packageDependencies)
    .filter(([name, version]) => Boolean(name) && Boolean(version))
    .sort(([a], [b]) => a.localeCompare(b));

  const packageJson = {
    name: normalizeProjectPackageName(projectName),
    private: true,
    version: "1.0.0",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      ...Object.fromEntries(userDependencies),
    },
  };

  return `${JSON.stringify(packageJson, null, 2)}\n`;
}

export function createReactBoilerplate(projectName, packageDependencies = {}) {
  const appTitle = projectName || "React Playground";
  const escapedTitle = JSON.stringify(appTitle);

  return {
    "/src/App.jsx": {
      code: indent([
        'import { useState } from "react";',
        'import { useUpdateEffect } from "./useUpdateEffect";',
        'import "./style.css";',
        "",
        `const APP_TITLE = ${escapedTitle};`,
        "",
        "export default function App() {",
        "  const [count, setCount] = useState(0);",
        "",
        "  useUpdateEffect(() => {",
        '    console.log("Count changed:", count);',
        "  }, [count]);",
        "",
        "  return (",
        '    <main className="app-shell">',
        "      <h1>{APP_TITLE}</h1>",
        '      <p>Edit files and watch preview update instantly.</p>',
        '      <div className="button-row">',
        '        <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>',
        '        <button onClick={() => setCount(0)}>Reset</button>',
        "      </div>",
        '      <h2 className="count">{count}</h2>',
        "    </main>",
        "  );",
        "}",
      ]),
    },
    "/src/index.jsx": {
      code: indent([
        'import React from "react";',
        'import { createRoot } from "react-dom/client";',
        'import App from "./App";',
        "",
        'const rootElement = document.getElementById("root");',
        "createRoot(rootElement).render(",
        "  <React.StrictMode>",
        "    <App />",
        "  </React.StrictMode>",
        ");",
      ]),
    },
    "/src/style.css": {
      code: indent([
        ":root {",
        "  color-scheme: dark;",
        "  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;",
        "}",
        "",
        "* {",
        "  box-sizing: border-box;",
        "}",
        "",
        "body {",
        "  margin: 0;",
        "  min-height: 100vh;",
        "  display: grid;",
        "  place-items: center;",
        "  background: radial-gradient(circle at top, #0f1f3f, #060c1f 65%);",
        "}",
        "",
        ".app-shell {",
        "  width: min(420px, 94vw);",
        "  padding: 2rem 1.4rem;",
        "  border-radius: 20px;",
        "  text-align: center;",
        "  background: rgba(8, 16, 36, 0.8);",
        "  border: 1px solid rgba(128, 149, 184, 0.3);",
        "  box-shadow: 0 18px 45px rgba(2, 8, 20, 0.55);",
        "}",
        "",
        "h1 {",
        "  margin-top: 0;",
        "  font-size: 1.8rem;",
        "}",
        "",
        "p {",
        "  color: #c3d3f4;",
        "}",
        "",
        ".button-row {",
        "  display: flex;",
        "  justify-content: center;",
        "  gap: 0.75rem;",
        "  margin: 1rem 0;",
        "}",
        "",
        "button {",
        "  border: 0;",
        "  border-radius: 10px;",
        "  padding: 0.55rem 1rem;",
        "  cursor: pointer;",
        "  font-weight: 600;",
        "  color: #07162d;",
        "  background: linear-gradient(120deg, #9fd2ff, #e3f2ff);",
        "}",
        "",
        ".count {",
        "  margin: 0;",
        "  font-size: 2rem;",
        "}",
      ]),
    },
    "/src/useUpdateEffect.js": {
      code: indent([
        'import { useEffect, useRef } from "react";',
        "",
        "export function useUpdateEffect(effect, deps) {",
        "  const isFirstRender = useRef(true);",
        "",
        "  useEffect(() => {",
        "    if (isFirstRender.current) {",
        "      isFirstRender.current = false;",
        "      return;",
        "    }",
        "",
        "    return effect();",
        "  }, deps);",
        "}",
      ]),
    },
    "/index.html": {
      code: indent([
        "<!doctype html>",
        '<html lang="en">',
        "  <head>",
        '    <meta charset="UTF-8" />',
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        "    <title>React Online Editor</title>",
        "  </head>",
        "  <body>",
        '    <div id="root"></div>',
        "  </body>",
        "</html>",
      ]),
    },
    "/package.json": {
      code: buildProjectPackageJson(projectName, packageDependencies),
    },
  };
}
