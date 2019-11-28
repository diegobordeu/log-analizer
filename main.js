// For reading .txt file code block
const fs = require('fs');
const moment = require('moment');
const merger = require('./filemerger');

// const text = fs.readFileSync('./log-backups/RS/(29-10 4-11)-2019').toString();sd

// const ANALIZE_ONLY_ANNA = false;
const RESULTS_LENGTH = 20;
// const TIME_FRAME = 1 * 1000; // 5 seg

// const textByLine = text.split('\n');


const formatDate = (str) => {
  const splited = str.split(' ');
  if (!splited[1]) return;
  const test = moment(splited[0]);
  return test.format();
};


const getResponseTime = (input) => {
  const r = input.split(' ms ');
  if (!r[1]) return;
  const p = r[0].split(' ');
  const f = p[p.length - 1];
  return f * 1;
};

const getRoute = (input) => {
  const r = input.split('] ');
  if (!r[1]) return;
  const p = r[1].split(' HTTP');
  if (!p[0]) return;
  let route = p[0];
  route = filterFromQuery(route, 'accessible_by');
  route = filterFromQuery(route, 'sponsor_id');
  route = filterFromQuery(route, 'place_id');
  route = filterFromQuery(route, 'start_date');
  route = filterFromQuery(route, 'endDate');
  route = filterFromQuery(route, 'startDate');
  route = sortQuery(route);
  return route;
};

const filterFromQuery = (route, prop) => {
  prop = prop || 'accessible_by';
  prop += '=';
  if (route.includes(prop)) {
    const strArray = route.split(prop);
    const rest = strArray[1].split('');
    let filter = prop.split('');
    for (let i = 0; i < rest.length; i++) {
      if (rest[i] === '&') {
        filter.push(rest[i]);
        break;
      }
      filter.push(rest[i]);
    }
    filter = filter.join('');
    route = route.replace(filter, '');
    if (route.split('')[route.length - 1] === '&') route = route.substring(0, route.length - 1);
    return route;
  } return route;
};

// console.log(filterFromQuery('GET /anna/impression/count/byhour?is_initial=true&accessible_by=111111'));
// console.log(filterFromQuery('GET /anna/impression/count/?groupBy=times_connected&is_initial=true&n=5&place_id=50', 'groupBy'));


const sortQuery = (route) => {
  const parts = route.split('?');
  if (!parts[1]) return route;
  let query = parts[1];
  query = query.split('&');
  query = query.sort();
  const newQuery = [];
  for (let i = 0; i < query.length; i++) {
    newQuery.push(query[i]);
    if (i !== query.length - 1) newQuery.push('&');
  }
  const response = [parts[0], '?', newQuery.join('')].join('');
  return response;
};


const main = async () => { // eslint-disable-line
  const textByLine = await merger('./log-backups/RS/nov21-nov28-2019/');
  const histogram = {};
  const report = [];
  let errors = 0;
  for (let i = 0; i < textByLine.length; i++) {
    const line = textByLine[i];
    if (!isErrorLine(line)) {
      pushResponseTime(line, histogram);
      buildReport(line, report);
    } else {
      errors += 1;
    }
    if (i % 10000 === 0) console.log(`${i / textByLine.length * 100} %`);
  }
  console.log({ errors });
  const final = metrics(histogram);
  const sorted = getSortedBy(final, 'avg');
  const average = getMaxAverage(sorted, RESULTS_LENGTH);
  console.log({ average });
  // sortReport(report, 'responseTime');
  // console.log({ report });
  // getAroundMax(report);
  return sorted;
};


const getMaxAverage = (data, count) => {
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += data[i].avg;
  }
  return sum / count;
};


const buildReport = (line, report) => {
  const parsed = parseLine(line);
  if (parsed.responseTime) report.push(parsed);
};


const pushResponseTime = (line, histogram) => {
  const parsed = parseLine(line);
  if (parsed.route) {
    if (!histogram[parsed.route]) histogram[parsed.route] = [];
    if (parsed.responseTime) histogram[parsed.route].push(parsed.responseTime);
  }
};

const getSortedBy = (obj, prop) => { // eslint-disable-line
  prop = prop || 'max';
  const response = [];
  const routes = Object.keys(obj);
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const metrics = obj[route];
    const element = {
      route,
      max: metrics.max || 1,
      min: metrics.min || 1,
      count: metrics.count || 1,
      avg: metrics.avg || 1,
    };
    response.push(element);
  }
  response.sort((a, b) => {
    return b[prop] - a[prop];
  });
  return response;
};


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
};

const averge = (arr) => {
  const arrAvg = (array) => { return array.reduce((a, b) => { return a + b; }, 0) / array.length; };
  return arrAvg(arr);
};


const parseLine = (line) => {
  const date = formatDate(line);
  const responseTime = getResponseTime(line);
  const route = getRoute(line);
  return { date, responseTime, route };
};

const isErrorLine = (line) => {
  if (line.includes('Error: Not Found')) return true;
  return !!line.split('at ')[1];
};

main().then((a) => {
  for (let i = 0; i < RESULTS_LENGTH; i++) {
    const elem = a[i];
    console.log(elem);
  }
}).catch((err) => {
  console.log({ err });
});

// main2().then((a) => {
//   console.log(a);
// }).catch((err) => {
//   console.log({ err });
// });


// const sortReport = (report, prop) => {
//   prop = prop || 'responseTime';
//   report = report.sort((a, b) => {
//     return b[prop] - a[prop];
//   });
// };

// const main2 = async () => {
//   const report = [];
//   let errors = 0;
//   for (let i = 0; i < textByLine.length; i++) {
//     const line = textByLine[i];
//     if (!isErrorLine(line)) {
//       buildReport(line, report);
//     } else {
//       errors += 1;
//     }
//     if (i % 10000 === 0) console.log(`${i / textByLine.length * 100} %`);
//   }
//   const max = getMaxDate(report);
//   getAroundMax(max, report);

// };


// const getMaxDate = (data) => {
//   data = data || [];
//   let max = { responseTime: 1 };
//   for (let i = 0; i < data.length; i++) {
//     if (max.responseTime < data[i].responseTime) max = data[i];
//   }
//   return max.date;
// };


// const getAroundMax = (report) => {
//   for (let j = 0; j < 5; j++) {
//     const maxMs = new Date(report[j].date).getTime();
//     console.log('++++++++++++++++++++++');
//     for (let i = 0; i < report.length; i++) {
//       const dateMs = new Date(report[i].date).getTime();
//       if (maxMs + TIME_FRAME > dateMs && maxMs - TIME_FRAME < dateMs) {
//         const time = new Date(new Date(report[i].date).getTime() - report[i].responseTime);
//         console.log(time.toISOString(), report[i].route, report[i].responseTime);
//       }
//     }
//   }
// };
