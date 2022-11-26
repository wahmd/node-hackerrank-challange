const https = require("https");
const fs = require("fs");
const crypto = require("crypto");

https.get("https://coderbyte.com/api/challenges/json/age-counting", (res) => {
  let body = "";
  res.on("data", function (chunk) {
    body += chunk;
  });
  res.on("end", function () {
    let response = JSON.parse(body);

    if (!response || !response.data) {
      console.log("ERR!! missing response");
      return;
    }

    const sets = response.data.replace(/ /g, "").split(",");

    const itemsCount = sets.reduce(
      (acc, curr) =>
        curr.includes("age") && parseInt(curr.split("=")[1], 10) === 32
          ? acc + 1
          : acc,
      0
    );

    // writing file
    const writer = fs.createWriteStream("./output.txt");
    let strToHash = "";
    sets.forEach((set) => {
      if (set.includes("key")) {
        const line = set.split("=")[1] + "\n";

        strToHash = strToHash + line;
        writer.write(line);
      }
    });

    writer.write("\n");

    const hashed = crypto.createHash("SHA256").update(strToHash).digest("hex");
    console.log(hashed);
  });
});
