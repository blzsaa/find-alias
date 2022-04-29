import fs from "fs";

export default function writeToFile(outputFile, command) {
  try {
    fs.writeFileSync(outputFile, `${command}\n`);
  } catch (err) {
    console.error(err);
  }
}
