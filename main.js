// For reading .txt file code block
const fs = require("fs");
const moment = require('moment');
const text = fs.readFileSync("./000000 (4)").toString();

const ANALIZE_ONLY_ANNA = true;
const RESULTS_LENGTH = 70;

// console.log(text);

var textByLine = text.split("\n");
console.log(textByLine.length);



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
  return f * 1;
}

const getRoute = (input) => {
  const r = input.split('] ');
  if (!r[1]) return;
  const p = r[1].split(' HTTP');
  if (!p[0]) return;
  if (!ANALIZE_ONLY_ANNA) return p[0];
  let route = p[0];
  route = filterFromQuery(route);
  route = sortQuery(route)
  return route.includes('anna') ?  route : undefined;
}

const filterFromQuery = (route) => {
  if (route.includes('accessible_by=')){
    const strArray = route.split('accessible_by=');
    let rest = strArray[1].split('');
    let filter = 'accessible_by='.split('');
    filter.push(rest[0]);
    if (rest[1] === '&') filter.push(rest[1]);
    filter = filter.join('');
    route = route.replace(filter, '');
    if (route.split('')[route.length - 1] === '&') route = route.substring(0, route.length - 1);
    return route
  } else return route;
}

const sortQuery = (route) => {
  parts = route.split('?');
  if (!parts[1]) return;
  let query = parts[1];
  query = query.split('&');
  query = query.sort();
  const newQuery = [];
  for (let i = 0; i < query.length; i++) {
    newQuery.push(query[i]);
    if(i !== query.length - 1) newQuery.push('&');
  }
  const response = [parts[0], '?', newQuery.join('')].join('');
  console.log(response);
  return response;
}
// console.log(filterFromQuery('GET /anna/impression/count/enduser?display=initial_portal&accessible_by=1'));
// console.log(filterFromQuery('GET /anna/impression/count/enduser?accessible_by=1&display=initial_portal'));


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
    if (!isErrorLine(line)){
      const parsed = parseLine(line);
      if (parsed.route){
        if (!histogram[parsed.route]) histogram[parsed.route] = [];
        if (parsed.responseTime) histogram[parsed.route].push(parsed.responseTime);
      }
    } else {
      errors++;
    }
    if (i % 10000 === 0) console.log(`${i/textByLine.length*100} %`);
  }
  console.log({errors,});
  const final = metrics(histogram);
  // console.log({final,});
  const sorted = getSortedBy(final, 'count');
  return sorted
}

const getSortedBy = (obj, prop) => {
  prop = prop || 'max';
  const response = [];
  const routes = Object.keys(obj);
  for (let j = 0; j < RESULTS_LENGTH; j++) {
    for (let i = 0; i < routes.length; i++) {
      if (!response[j]) response.push({
        route: '',
        metrics: {
          max: 1,
          min: 1,
          avg: 1,
          count: 1,
        },
      });
      if (obj[routes[i]][prop] > response[j].metrics[prop]) {
        response[j] = {
          route: routes[i],
          metrics: obj[routes[i]],
        }
        routes.splice(i,1);
      }
    }
  }
  return response;
}



const metrics = (data) => {
  const routes = Object.keys(data);
  const response = {};
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    response[route] = {
      max: Math.max.apply(Math, data[route]),
      min: Math.min.apply(Math, data[route]),
      avg: averge(data[route]),
      count: data[route].length,
    };
  }
  return response;
}

// function checkForNan(array){
//   console.log('start checking nannnnnnnnnnnnnnnnnnnnnnnnnnnnnn', array.length);
//   if(array.length ===2){
//     console.log(typeof array[0]);
//     console.log(typeof array[1]);
//   }
//   for (let i = 0; i < array.length; i++) {
//     if (isNaN(array[i])) console.log('+++++++++++++++++++++++++++++++++');
//     if (typeof array[i] !== 'number') console.log('---------------------------------');
    
//   }
// }

const averge = (arr) => {
  const arrAvg = array => array.reduce((a,b) => a + b, 0) / array.length
  return arrAvg(arr);
}



const parseLine = (line) => {
  const date = formatDate(line);
  const responseTime = getResponseTime(line);
  const route = getRoute(line);
  return {date, responseTime, route}
}

const isErrorLine = (line) => {
  if(line.includes('Error: Not Found')) return true;
  return !!line.split('at ')[1];
}

main().then((a) => {
  console.log(a);
}).catch((err) => {
  console.log({err});
})
