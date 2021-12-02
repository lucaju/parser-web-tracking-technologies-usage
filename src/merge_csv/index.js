const chalk = require('chalk');
const fs = require('fs-extra');
const Papa = require('papaparse');
const path = require('path');

let uid = 0;

const initiate = async () => {
  console.log('\n------------');
  console.log(chalk.magenta('Initiating\n'));

  const dataSource = path.join(__dirname, 'data');

  //file collection
  const files = fs.readdirSync(dataSource);
  const csfFiles = files.filter((file) => file.endsWith('.csv'));

  let result = [];

  //loop throght files
  for (const filename of csfFiles) {
    console.log(`${chalk.blue('File: ')} ${filename}`);

    const string = await fs.readFile(`${dataSource}/${filename}`, 'utf8');
    const content = await convertToJson(string);

    const parsedContent = parse(filename, content.data);
    result = [...result, ...parsedContent];
  }

  //add header
  const header =
    'uid,filename,id,Name,Categories,Description,Tag,FirstDetected,LastDetected,IsPremium,Link,Parent';
  result.unshift(header.split(','));

  //save
  await saveCSV(result);

  console.log(chalk.magenta('\nDone'));
  console.log('------------\n');
};

const parse = (filename, data) => {
  //remove header
  data.shift();

  //remove empty lines
  data = data.filter((row) => row.length > 1);

  //add file name and uid
  data.forEach((row, index) => {
    row.unshift(filename);
    row.unshift(uid);
    uid++;
  });

  return data;
};

const convertToJson = async (path) => {
  return new Promise((resolve) => {
    Papa.parse(path, {
      delimiter: ',',
      complete: (results) => resolve(results),
    });
  });
};

const saveCSV = async (data) => {
  console.log(chalk.blue('\nSaving CSV file'));

  const folder = path.join(__dirname, 'results');
  const fileName = 'merged_csv.csv';

  //tranform
  const csv = Papa.unparse(data, { delimiter: ',' });

  //save csv file
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  await fs.writeFile(`${folder}/${fileName}`, csv).catch((error) => {
    console.log(error);
    return false;
  });

  return true;
};

const saveJson = async (data) => {
  console.log(chalk.blue('\nSaving JSON file'));

  const folder = 'results';
  const fileName = 'results.json';

  const jsonOptions = { spaces: 4 };

  //Save Json file
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  await fs.writeJSON(`./${folder}/${fileName}`, data, jsonOptions).catch((error) => {
    console.log(error);
    return false;
  });

  return true;
};

initiate();
