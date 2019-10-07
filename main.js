// For reading .txt file code block
var fs = require("fs");
var text = fs.readFileSync("./testLog.txt").toString();
console.log(text);

var textByLine = text.split("\n");


const INIZIALIZER = '/var/log/nodejs/nodejs.log';
const FINALIZER = '/var/log/nginx/error.log';

const initial = textByLine.indexOf(INIZIALIZER);
const final = textByLine.indexOf(FINALIZER);

console.log(initial, final);


const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
}


const main = async () => {
  for (let i = initial; i < final; i++) {
    console.log(textByLine[i]);
    await delay(100);
  }
}

main().then((a) => {
  console.log(a);
}).catch((err) => {
  console.log({err});
})
