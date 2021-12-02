const chalk = require('chalk');
const fs = require('fs-extra');
const Papa = require('papaparse');

const initiate = async () => {
  console.log('\n------------');
  console.log(chalk.magenta('Initiating\n'));

  const dataSource = './data';

  //file collection
  const files = fs.readdirSync(dataSource);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  let result = [];

  //loop throght files
  for (const file of jsonFiles) {
    console.log(`${chalk.blue('File: ')} ${file}`);
    const data = await loadData(`${dataSource}/${file}`);

    console.log(chalk.blue('Parsing...'));
    const techs = parse(data);

    result = [...result, ...techs];
    console.log('----');
  }

  //save
  await saveCSV(result);

  console.log(chalk.magenta('\nDone'));
  console.log('------------\n');
};

const parse = (data) => {
  const techs = [];

  const { Result, Meta, Lookup } = data.Results.APIResultWithMetaV16;
  const { Paths } = Result;

  const CompanyName = Meta.CompanyName;
  const Url = Lookup;

  for (const path of Paths) {
    if (Array.isArray(path.Technologies)) {
      for (const tech of path.Technologies) {
        const { Name: Technology, Description, Link, Tag, FirstDetected, LastDetected } = tech;
        techs.push({
          CompanyName,
          Url,
          Technology,
          Description,
          Link,
          Tag,
          FirstDetected,
          LastDetected,
        });
      }
    } else {
      const { Technology: tech } = path.Technologies;
      const { Name: Technology, Description, Link, Tag, FirstDetected, LastDetected } = tech;
      techs.push({
        CompanyName,
        Url,
        Technology,
        Description,
        Link,
        Tag,
        FirstDetected,
        LastDetected,
      });
    }
  }

  console.log(`${CompanyName} (${Url}):  ${chalk.yellow(`${techs.length} technologies`)}`);
  return techs;
};

const loadData = async (path) => {
  const data = await fs.readJson(path).catch((error) => {
    throw new Error(error);
  });
  return data;
};

const saveCSV = async (data) => {
  console.log(chalk.blue('\nSaving CSV file'));

  const folder = 'results';
  const fileName = 'results.csv';

  //tranform
  const csv = Papa.unparse(data, { delimiter: ',' });

  //save csv file
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const written = await fs.writeFile(`./${folder}/${fileName}`, csv).catch((error) => {
    console.log(error);
    return false;
  });

  return !!written;
};

const saveJson = async (data) => {
  console.log(chalk.blue('\nSaving JSON file'));

  const folder = 'results';
  const fileName = 'results.json';

  const jsonOptions = { spaces: 4 };

  //Save Json file
  if (!fs.existsSync(folder)) fs.mkdirSync(folder);
  const written = await fs
    .writeJSON(`./${folder}/${fileName}`, data, jsonOptions)
    .catch((error) => {
      console.log(error);
      return false;
    });

  return !!written;
};

initiate();
