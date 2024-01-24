const fs = require('fs');
const path = require('path');

const filePath = __dirname + '/files';
const copyFilePath = __dirname + '/files-copy';

// Delete all files in a folder
fs.readdir(copyFilePath, (err, files) => {
  if (err) {
    // console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(copyFilePath, file);

    // Use fs.unlink to delete files
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', filePath, err);
      } else {
        console.log('Deleted file:', filePath);
      }
    });
  });
});

// Create files-copy dir
fs.mkdir(copyFilePath, { recursive: true }, (e, dir) => {
  if (e) console.error(e);
});

// read 'files' folder
fs.readdir(filePath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  // check each file in 'files' folder
  files.forEach((file) => {
    fs.stat(path.join(filePath, file), (err, fileData) => {
      if (err) {
        console.error(err);
        return;
      }
      // check same file in COPY folder
      fs.stat(path.join(copyFilePath, file), (err, copyFileData) => {
        // here need to be function of file 'COPY to DIR'
        function cFile(src, dest) {
          fs.copyFile(src, dest, (err) => {
            if (err) {
              console.error(`Error copying file: ${err.message}`);
            } else {
              console.log('File copied successfully.');
            }
          });
        }

        // we need to check, is the file 'exist'
        if (err) {
          if (err.code === 'ENOENT') {
            console.error('File does not exist.');
            cFile(path.join(filePath, file), path.join(copyFilePath, file));
          } else {
            console.error(`Error checking file existence: ${err.message}`);
          }
        } else {
          console.log('File exists.');
          // if we have file, we need to check modify data of file
          if (fileData.mtimeMs != copyFileData.mtimeMs) {
            console.log('File has changed, copy new file.');
            cFile(path.join(filePath, file), path.join(copyFilePath, file));
          }
        }
      });
    });
  });
});
