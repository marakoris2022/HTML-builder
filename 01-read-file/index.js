const fs = require('fs');

const readFile = fs.createReadStream('./01-read-file/text.txt', 'utf8');

readFile.on('data', (data) => {
  console.log(data);
});
