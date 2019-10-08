// For reading .txt file code block
var fs = require("fs");
const moment = require('moment');
var text = fs.readFileSync("./000000 (1)").toString();

// console.log(text);

var textByLine = text.split("\n");
// console.log(textByLine);



const formatDate = (str) => {
  const splited = str.split(' [');
  const test = moment(splited[0]);
  return test.format();
}


const getResponseTime = (input) => {
  const r = input.split('ms ');
  if (!r[1]) return;
  const p = r[1].split(' "');
  if (!p[0]) return;
  return p[0];
}

const getRoute = (input) => {
  const r = input.split('] ');
  if (!r[1]) return;
  const p = r[1].split(' HTTP');
  if (!p[0]) return;
  return p[0];
}




const INIZIALIZER = '/var/log/nodejs/nodejs.log';
const FINALIZER = '/var/log/nginx/error.log';

// const initial = textByLine.indexOf(INIZIALIZER);
// const final = textByLine.indexOf(FINALIZER);

// console.log(initial, final);

const analizeLine = () => {

}

const getTime = (input) => {
  const p1 = input.split('[');
  if (!p1[1]) return;
  const p2 = p1[1].split(']');;
  const strDate = p2[0];
  const date = new Date();
  console.log(new Date(p2[0]));
  
  return p2[0];
}

const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
}


const main = async () => {
  console.log({herma: textByLine.length});
  for (let i = 0; i < textByLine.length; i++) {
    console.log(textByLine[i]);
    // if (i === textByLine.length - 100 ) console.log('final', formatDate(textByLine[i]));
    // if (i === 0 ) console.log('initial', formatDate(textByLine[i]));
    await delay(1);
  }
}

main().then((a) => {
  console.log(a);
}).catch((err) => {
  console.log({err});
})
