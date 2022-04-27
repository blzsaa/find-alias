import fs from "fs";

export default function writeToFile(answers) {
  const outputFile = process.argv[3];
  try {
    fs.writeFileSync(outputFile, `${answers.result}\n`);
  } catch (err) {
    console.error(err);
  }
}
