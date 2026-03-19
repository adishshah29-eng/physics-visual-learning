import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Parser } from 'json2csv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mappedMathsJsonPath = path.join(__dirname, '../mcqs/mapped_maths.json');

const mappedData = JSON.parse(fs.readFileSync(mappedMathsJsonPath, 'utf8'));

const fields = [
  'id', 'exam', 'subject', 'chapter', 'year',
  'question_text', 'option_a', 'option_b', 'option_c', 'option_d',
  'correct_option', 'explanation', 'difficulty', 'tags'
];

try {
  const parser = new Parser({ fields });
  const csv = parser.parse(mappedData);
  const csvPath = path.join(__dirname, '../mcqs/mapped_maths.csv');
  fs.writeFileSync(csvPath, csv);
  console.log(`Successfully generated CSV at ${csvPath}`);
} catch (err) {
  console.error("Failed to generate CSV:", err);
}
