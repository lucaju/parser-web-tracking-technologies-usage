# Parser tracking technologies

This parser filters, reduces, and converts (JSON -> CSV) data collected from [BuiltWith Domain API](https://api.builtwith.com/domain-api).

## Install

1. Install [NodeJs]((https://nodejs.org/en/)), if you don't have it yet.
2. Download this code.
3. Install dependencies `npm install`

## Run

- Put Json files on the `data` folder.
- Run `npm start`

The code will loop through json files on `data` folder combining all the data on a single table. The results will be saved on the `results` folder as a CSV file.

## Results

The CSV file will contain a subset of the data on the JSON file strucutre in a table with the following headers:
`CompanyName,Url,Technology,Description,Link,Tag,FirstDetected,LastDetected`
