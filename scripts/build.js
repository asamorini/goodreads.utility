const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

(async function () {
  const root = path.resolve(__dirname, "..");
  const sourcePath = path.join(root, "src/js/goodreads.utility.v2.6.5.js");
  const dataPath = path.join(root, "src/js/CITAZIONI.json");
  const distPath = path.join(root, "dist/goodreads.utility.min.js");
  const source = fs.readFileSync(sourcePath, "utf8");
  const citations = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const marker = "/* CITAZIONI_BUILD_INJECT */{}";

  if (!source.includes(marker)) {
    throw new Error("Marker CITAZIONI_BUILD_INJECT non trovato nel sorgente.");
  }

  const bundled = source.replace(marker, JSON.stringify(citations));
  const result = await minify(bundled, {
    compress: true,
    mangle: true,
    format: { comments: false }
  });

  if (!result.code) throw new Error("Minificazione non riuscita.");
  fs.writeFileSync(distPath, result.code + "\n", "utf8");
  console.log(`Creato ${path.relative(root, distPath)} con ${Object.keys(citations).length} autori.`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
