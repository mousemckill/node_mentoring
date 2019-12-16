import path from "path";
import { createReadStream, createWriteStream } from "fs";
import csv from "csvtojson";

const csvFilePath = path.resolve(
  "csv",
  "node_mentoring_t1_2_input_example.csv"
);
const txtFilePath = path.resolve(
  "csv",
  "node_mentoring_t1_2_input_example.txt"
);

const input = createReadStream(csvFilePath);
const output = createWriteStream(txtFilePath);

input.on("error", () => console.error("Input file not Found!"));

csv({
  headers: ["book", "author", "amount", "price"],
  ignoreColumns: /amount/i
})
  .fromStream(input)
  .subscribe(
    jsonData => {
      return new Promise((resolve, reject) => {
        output.write(JSON.stringify(jsonData) + "\n", reject);
        resolve();
      });
    },
    e => console.error(e),
    () => console.log("Finished")
  );
