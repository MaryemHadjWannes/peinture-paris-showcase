import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const distDir = resolve(__dirname, "../dist");
  const templatePath = resolve(distDir, "index.html");
  const template = readFileSync(templatePath, "utf-8");

  const { render } = await import("../dist-ssr/entry-server.js");
  const { html, helmet } = await render("/");

  const helmetTags = [
    helmet?.title?.toString() ?? "",
    helmet?.meta?.toString() ?? "",
    helmet?.link?.toString() ?? "",
    helmet?.script?.toString() ?? "",
    helmet?.style?.toString() ?? "",
    helmet?.noscript?.toString() ?? "",
  ]
    .filter(Boolean)
    .join("\n    ");

  const finalHtml = template
    .replace("<!--app-helmet-->", helmetTags)
    .replace("<!--app-html-->", html);

  writeFileSync(templatePath, finalHtml, "utf-8");
}

run().catch((error) => {
  console.error("Prerender failed:", error);
  process.exit(1);
});
