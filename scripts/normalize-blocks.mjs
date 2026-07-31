#!/usr/bin/env node

import {readFileSync, readdirSync, writeFileSync} from "node:fs";
import {join, resolve} from "node:path";

const blocksRoot = resolve("registry", "blocks");
const names = readdirSync(blocksRoot, {withFileTypes: true})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const name of names) {
  const itemRoot = join(blocksRoot, name);
  const manifest = JSON.parse(readFileSync(join(itemRoot, "registry-item.json"), "utf8"));
  const htmlFile = manifest.files.find((file) => file.type === "hyperframes:composition");
  if (!htmlFile) throw new Error(`${name}: composition absente du manifeste`);

  const htmlPath = join(itemRoot, htmlFile.path);
  const source = readFileSync(htmlPath, "utf8");
  if (/<!doctype html>/i.test(source)) continue;

  const opening = source.match(/<template\b[^>]*>/i);
  const closingIndex = source.lastIndexOf("</template>");
  if (!opening || opening.index === undefined || closingIndex < opening.index) {
    throw new Error(`${name}: fragment <template> invalide`);
  }

  const prefix = source.slice(0, opening.index).trim();
  let body = source
    .slice(opening.index + opening[0].length, closingIndex)
    .trim()
    .replace(
      /<script\s+src=["']https:\/\/cdn\.jsdelivr\.net\/npm\/gsap@[^"']+["']><\/script>/gi,
      "",
    )
    .replaceAll("url('assets/", "url('../assets/")
    .replaceAll('url("assets/', 'url("../assets/')
    .replaceAll('src="assets/', 'src="../assets/')
    .replaceAll("src='assets/", "src='../assets/");

  body = body.replace(
    /(<div\b[^>]*\bdata-composition-id=["'][^"']+["'])/i,
    (match) => {
      let root = match;
      if (!/\bdata-start=/.test(root)) root += ' data-start="0"';
      if (!/\bdata-duration=/.test(root)) root += ` data-duration="${manifest.duration}"`;
      return root;
    },
  );
  body = body.replace(
    /<video\b([^>]*\bdata-start=[^>]*)>/gi,
    (match, attributes) => {
      if (/\bclass=["'][^"']*\bclip\b/i.test(attributes)) return match;
      if (/\bclass=["']/i.test(attributes)) {
        return match.replace(/\bclass=(["'])/i, "class=$1clip ");
      }
      return `<video class="clip"${attributes}>`;
    },
  );

  const document = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080,height=1920">
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>html,body{margin:0;width:100%;height:100%;overflow:hidden}*{box-sizing:border-box}</style>
</head>
<body>
${prefix ? `${prefix}\n` : ""}${body}
</body>
</html>
`;
  writeFileSync(htmlPath, document);
}

console.log(`Blocs normalisés : ${names.length}`);
