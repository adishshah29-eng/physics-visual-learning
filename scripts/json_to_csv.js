import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const jsonPath = path.join(__dirname, '../mcqs/mapped_chemistry.json');
const csvPath = path.join(__dirname, '../mcqs/mapped_chemistry.csv');

console.log('Reading JSON...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (data.length === 0) {
  console.log('Empty JSON file.');
  process.exit(0);
}

const headers = Object.keys(data[0]);

const escapeCsv = (str) => {
  if (str === null || str === undefined) return '';
  const stringified = String(str);
  if (stringified.includes(',') || stringified.includes('\n') || stringified.includes('"')) {
    return `"${stringified.replace(/"/g, '""')}"`;
  }
  return stringified;
};

console.log('Building CSV...');
const csvRows = [];
csvRows.push(headers.join(','));

for (const row of data) {
  const values = headers.map(header => escapeCsv(row[header]));
  csvRows.push(values.join(','));
}

console.log('Writing CSV...');
fs.writeFileSync(csvPath, csvRows.join('\n'));
console.log(`Saved successfully to ${csvPath}!`);
