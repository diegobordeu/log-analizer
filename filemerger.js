// For reading .txt file code block
const fs = require('fs');


const merger = (folderDir) => {
  return new Promise((resolve, reject) => {
    fs.readdir('././log-backups/RS/oct31-nov7-2019/', (err, files) => {
      console.log(`analizing files: ${files}`);
      if (err) return reject(new Error(err));
      const data = [];
      const sum = [];
      for (let i = 0; i < files.length; i++) {
        const text = fs.readFileSync(`${folderDir}${files[i]}`).toString().split('\n');
        data.push(text);
      }
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          sum.push(data[i][j]);
        }
      }
      return resolve(sum);
    });
  });
};

const main = async (folderDir) => {
  const sum = await merger(folderDir);
  console.log('+++++++++++++ summary +++++++++++++++++');
  console.log(sum[0]);
  console.log(sum[sum.length - 100]);
  console.log(sum.length);
  console.log('++++++++++++++++++++++++++++++++++++++');
  return sum;
};

module.exports = main;

// main('././log-backups/RS/oct31-nov7-2019/');
