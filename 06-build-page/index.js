// 1. Import all required modules.
const fs = require('fs').promises;
const path = require('path');

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function writeFile(filePath, dataToWrite) {
  try {
    const data = await fs.writeFile(filePath, dataToWrite, 'utf8');
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function getTagList(tempData) {
  let tagNamesArr = [];
  function docRun(text, index) {
    let start = -1;
    let end = -1;
    start = String(text).indexOf('{{', index);
    end = String(text).indexOf('}}', index);
    if (start != -1 && end != -1) {
      tagNamesArr.push(String(text).slice(start, end + 2));
      docRun(text, end + 1);
    }
  }
  docRun(tempData, 0);
  // clean array from duplicate
  tagNamesArr = Array.from(new Set(tagNamesArr));
  return tagNamesArr;
}

async function getDataFromTag(tagList) {
  returnObj = {};
  try {
    // remove {{}} from tagList
    const cleanTagList = tagList.map((tag) => {
      let temptag = tag;
      temptag = String(temptag).replace('{{', '');
      temptag = String(temptag).replace('}}', '');
      return temptag;
    });
    await Promise.all(
      cleanTagList.map(async (tag) => {
        returnObj[tag] = await readFile(
          path.join(__dirname, 'components', tag + '.html'),
        );
      }),
    );
    return returnObj;
  } catch (error) {
    console.error(error);
  }
}

function generateIndexHTML(tagDataObject, tempData) {
  let returnData = tempData;
  function rep() {
    if (returnData.indexOf('{{') == -1) {
      return;
    }
    for (key in tagDataObject) {
      returnData = returnData.replace('{{' + key + '}}', tagDataObject[key]);
    }
    rep();
  }
  rep();
  return returnData;
}

async function getDataFromCss(cssPath) {
  let cssText = [];
  const cssList = await fs.readdir(cssPath);
  await Promise.all(
    cssList.map(async (cssFile) => {
      cssText.push(await readFile(path.join(cssPath, cssFile)));
    }),
  );

  return cssText.join('');
}

async function copyAssets(pathFrom, pathTo) {
  // get folder list
  const dirList = await fs.readdir(pathFrom);
  await Promise.all(
    dirList.map(async (dirName) => {
      // Create `each folder from assets` folder
      await fs.mkdir(path.join(pathTo, dirName), { recursive: true });
      const fileList = await fs.readdir(path.join(pathFrom, dirName));
      await Promise.all(
        // copy each file from each folder
        fileList.map(async (file) => {
          await fs.copyFile(
            path.join(pathFrom, dirName, file),
            path.join(pathTo, dirName, file),
          );
        }),
      );
    }),
  );
}

async function main() {
  try {
    // 2. Read and save the template file in a variable.
    const tempData = await readFile(path.join(__dirname, 'template.html'));
    // 3. Find all tag names in the template file.
    const tagList = getTagList(tempData);
    // 4. Replace template tags with the content of component files.
    // make Object with { TagName : TagData }
    const tagDataObject = await getDataFromTag(tagList);
    // generate index.html data from template
    const tempIndexHTML = generateIndexHTML(tagDataObject, tempData);
    // 5. Write the modified template to the `index.html` file in the `project-dist` folder.
    // Create `project-dist` folder
    await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    // Create `index.html`
    await writeFile(
      path.join(__dirname, 'project-dist', 'index.html'),
      tempIndexHTML,
    );
    // 6. Use the script written in task **05-merge-styles** to create the `style.css` file.
    const tempCssData = await getDataFromCss(path.join(__dirname, 'styles'));
    // Create `style.css`
    await writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      tempCssData,
    );
    // 7. Use the script from task **04-copy-directory** to move the `assets` folder into the `project-dist` folder.
    // Create `assets` folder
    await fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {
      recursive: true,
    });
    await copyAssets(
      path.join(__dirname, 'assets'),
      path.join(__dirname, 'project-dist', 'assets'),
    );
  } catch (error) {
    console.error(error);
  }
}

main();
