// For reading .txt file code block
const fs = require('fs');

const dir = '././log-backups/RS/oct31-nov7-2019/';

const merger = () => {
  const text1 = fs.readFileSync(`${dir}week1`).toString().split('\n');
  console.log(text1.length);
  const text2 = fs.readFileSync(`${dir}week2`).toString().split('\n');
  console.log(text2.length);
  const text3 = fs.readFileSync(`${dir}week3`).toString().split('\n');
  console.log(text3.length);
  const data = [text1, text2, text3];
  const sum = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      sum.push(data[i][j]);
    }
  }
  return sum;
};

const main = async () => {
  const sum = merger();
  console.log(sum[0]);
  console.log(sum[sum.length - 100]);
  console.log(sum.length);
};

main().then(() => {
  // console.log(a);
}).catch((err) => {
  console.log({ err });
});
