// For reading .txt file code block
const fs = require("fs");
const moment = require('moment');
const text = fs.readFileSync("./000000 (4)").toString();
var textByLine = text.split("\n");


const formatDate = (str) => {
  const splited = str.split(' ');
  if(!splited[1]) return;
  const test = moment(splited[0]);
  return test.format();
}


const isErrorLine = (line) => {
  if(line.includes('Error: Not Found')) return true;
  return !!line.split('at ')[1];
}

const main = async () => {
  const histogram = {};
  let errors = 0;
  console.log(textByLine[0]);
  console.log(textByLine[textByLine.length-100]);
  console.log(textByLine.length);
  // for (let i = 0; i < textByLine.length; i++) {
  //   const line = textByLine[i];
  //   if (!isErrorLine(line)){
      
  //   }
  // }
}

main().then((a) => {
  // console.log(a);
}).catch((err) => {
  console.log({err});
})