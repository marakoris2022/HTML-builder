const fs = require('fs');
const path = require('path');
const MainFolder = './03-files-in-folder/secret-folder/';

function getFilesData(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error(err);
    }

    if (files) {
      files.forEach((file) => {
        fs.stat(folder + file, (err, stats) => {
          if (err) {
            console.error(err);
          }

          if (stats.isFile()) {
            let fileExt = path.extname(folder + file);
            let fileName = path.basename(folder + file).replace(fileExt, '');
            let fileSize = stats.size / 1000;

            console.log(
              fileName +
                ' - ' +
                fileExt.replace('.', '') +
                ' - ' +
                fileSize +
                'kb',
            );
          }
        });
      });
    }
  });
}
getFilesData(MainFolder);
