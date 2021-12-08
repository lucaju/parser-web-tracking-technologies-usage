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

  //save
  // console.log(result);
  await saveCSV(result);

  console.log(chalk.magenta('\nDone'));
  console.log('------------\n');
};

const parse = (filename, data) => {
  //remove header
  data.shift();

  //remove empty lines
  data = data.filter((row) => row.length > 1);

  const country = filename.split('_')[0].replace('-', ' ');
    console.log(country)

  const list = [];

  //add file name and uid
  data.forEach((row, index) => {

    const duration = Number(row[6]) - Number(row[5]);
    const firstDetectedDate = new Date(Number(row[5]));
    const lastDetectedDate = new Date(Number(row[6]));
    
    
    const item = {
      uid,
      filename,
      country,
      id: Number(row[0]),
      name: row[1],
      categories: row[2],
      description: row[3],
      tag: row[4],
      isPremium: row[7],
      link: row[8],
      parent: row[9],
      firstDetectedTimestamp: Number(row[5]),
      lastDetectedTimestamp: Number(row[6]),
      duration,
      firstDetectedDate,
      lastDetectedDate,
    }

    list.push(item)
    
    uid++;
  });

  return list;
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
