// 1. Import all required modules.
const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');

// Create/rebuild file 'bundle.css'
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
function createFile() {
  fs.writeFile(bundlePath, '', 'utf8', (err) => {
    if (err) {
      console.error(`Error creating file: ${err.message}`);
    } else {
      console.log('File created successfully.');
    }
  });
}
// we need to check, is the file 'exist'
fs.stat(bundlePath, (err, file) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error('File does not exist.');
      createFile();
    } else {
      console.error(`Error checking file existence: ${err.message}`);
    }
  } else {
    console.log('File exists.');
    // if we have file, we will rewrite it
    createFile();
  }
});

// 2. Read the contents of the `styles` folder.
fs.readdir(stylesFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  // 3. Check if an object in the folder is a file and has the correct file extension.
  files.forEach((file) => {
    fs.stat(path.join(stylesFolder, file), (err, fileStat) => {
      if (err) {
        console.error(err);
        return;
      }
      if (
        fileStat.isFile() &&
        path.extname(path.join(stylesFolder, file)) == '.css'
      ) {
        // 4. Read the style file.
        const cssFile = path.join(stylesFolder, file);
        const readFile = fs.createReadStream(cssFile, 'utf8');
        readFile.on('data', (data) => {
          // SKIP --- 5. Write the read data to an array.
          // 6. Write the array of styles to the `bundle.css` file.
          fs.appendFile(bundlePath, data, 'utf8', (err) => {
            if (err) {
              console.error(`Error appending to file: ${err.message}`);
            } else {
              console.log('Content appended successfully.');
            }
          });
        });
      }
    });
  });
});
