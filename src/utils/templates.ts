import fs from "fs";

function getPrintTemplate(filename: string) {
  return fs.readFileSync(filename);
}
