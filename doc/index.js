const asciidoctor = require("asciidoctor");
const { Glob } = require("glob");
const { copyFile, mkdirSync } = require("fs");

const Asciidoctor = asciidoctor();

console.log("Generiere Dokumentation ...", "...", "...");

const documents = new Glob("src/**/*.adoc", { nocase: true }).walkSync();
const docsDir = "generated";

console.log(`${documents.length} Dateien zu erzeugen`);

for (const document of documents) {
  const fileInfo = extractFileParts(document);
  console.log(`Erzeuge ${fileInfo.filename} unter ${fileInfo.dir}`);
  Asciidoctor.convertFile(document, {
    safe: "unsafe",
    attributes: {
      linkcss: true,
      stylesheet: fileInfo.pathToDirRoot + "dark.css",
    },
    mkdirs: true,
    to_dir: `${docsDir}/${fileInfo.dir}`,
  });
}

function extractFileParts(filepath) {
  filepath = filepath.replaceAll("\\", "/");

  if (!filepath.includes("/")) {
    return { filename: filepath, dir: "", pathToDirRoot: "./" };
  }

  if (filepath.endsWith("/")) {
    filepath = filepath.substring(0, filepath.length - 1);
  }

  const directoryDepth = filepath.split("/").length - 2;

  return {
    filename: filepath.substring(
      filepath.lastIndexOf("/") + 1,
      filepath.length,
    ),
    dir: filepath.substring(0, filepath.lastIndexOf("/")),
    pathToDirRoot: "../".repeat(directoryDepth),
  };
}
