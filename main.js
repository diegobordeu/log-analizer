// For reading .txt file code block
var fs = require("fs");
const moment = require('moment');
var text = fs.readFileSync("./000000 (1)").toString();

// console.log(text);

var textByLine = text.split("\n");
// console.log(textByLine);



const formatDate = (str) => {
  const splited = str.split(' ');
  if(!splited[1]) return;
  const test = moment(splited[0]);
  return test.format();
}


const getResponseTime = (input) => {
  const r = input.split(' ms ');
  if (!r[1]) return;
  const p = r[0].split(' ');
  const f = p[p.length - 1];
  // if (f) console.log(f);
  // if (!f) console.log(f);
  return f * 1;
}

const getRoute = (input) => {
  const r = input.split('] ');
  if (!r[1]) return;
  const p = r[1].split(' HTTP');
  if (!p[0]) return;
  return p[0];
}


const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
}


const main = async () => {
  const histogram = {};
  let errors = 0;
  for (let i = 0; i < textByLine.length; i++) {
    const line = textByLine[i];
    if (isErrorLine(line)){
      const parsed = parseLine(line);
      if (parsed.route){
        if (!histogram[parsed.route]) histogram[parsed.route] = [];
        if (parsed.responseTime) histogram[parsed.route].push(parsed.responseTime);
      } else {
        errors++;
      }
    }
    // await delay(1);
    if (i % 100 === 0) console.log(i/textByLine.length);
  }
  console.log({errors,});
  const final = metrics(histogram);
  console.log({final,});
}

const metrics = (data) => {
  const routes = Object.keys(data);
  const response = {};
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    response[routes[i]] = {
      max: Math.max(data[route]),
      min: Math.min(data[route]),
      avg: averge(data[route]),
      count: data[route].length,
    }; 
  }
  return response;
}


const averge = (arr) => {
  const arrAvg = array => array.reduce((a,b) => a + b, 0) / array.length
  return arrAvg(arr);
}



const parseLine = (line) => {
  const date = formatDate(line);
  const responseTime = getResponseTime(line);
  if (isNaN(responseTime)) console.log(line);
  const route = getRoute(line);
  return {date, responseTime, route}
}

const isErrorLine = (line) => {
  return !line.split('at ')[1];
}

main().then((a) => {
  console.log(a);
}).catch((err) => {
  console.log({err});
})
