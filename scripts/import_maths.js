import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Superbase URL or Anon Key. Check .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const importData = async () => {
  console.log("Reading JSON file...");
  const jsonPath = path.join(__dirname, '../mcqs/JEE(mains)_Maths_2026.json');
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  let data = JSON.parse(rawData);

  console.log(`Loaded ${data.length} total questions.`);

  // Filter out numericals for now, since UI expects exactly 4 options and 'a'/'b'/'c'/'d'
  data = data.filter(q => q.type === 'singleCorrect');
  console.log(`Filtered down to ${data.length} singleCorrect questions.`);

  // Process all records, we can batch them during insertion
  const batch = data;

  const formattedQuestions = batch.map(q => {
    // Extract year
    const yearMatch = q.year?.match(/\d{4}/);
    const parsedYear = yearMatch ? parseInt(yearMatch[0]) : 2026;

    // Use original numeric difficulty
    const diff = q.difficulty?.toString() || '2';

    // Figure out the correct option letter
    let correctOpt = 'a';
    if (q.options?.length >= 4) {
      const idx = q.options.findIndex(opt => opt.isCorrect);
      if (idx === 0) correctOpt = 'a';
      if (idx === 1) correctOpt = 'b';
      if (idx === 2) correctOpt = 'c';
      if (idx === 3) correctOpt = 'd';
    } else {
        correctOpt = 'a'; // default fallback for weird records
    }

    return {
      id: q.id,
      exam: 'jee-main',
      subject: 'maths',
      chapter: slugify(q.chapter),
      year: parsedYear,
      question_text: q.questionText,
      option_a: q.options?.[0]?.text || '',
      option_b: q.options?.[1]?.text || '',
      option_c: q.options?.[2]?.text || '',
      option_d: q.options?.[3]?.text || '',
      correct_option: correctOpt,
      explanation: q.solution || null,
      difficulty: diff,
      tags: null
    };
  });

  console.log(`Writing ${formattedQuestions.length} parsed records to mcqs/mapped_maths.json in case you want to upload via Supabase Dashboard...`);
  fs.writeFileSync(path.join(__dirname, '../mcqs/mapped_maths.json'), JSON.stringify(formattedQuestions, null, 2));

  console.log(`Attempting to insert ${formattedQuestions.length} records into Supabase in batches...`);
  
  let totalInserted = 0;
  for (let i = 0; i < formattedQuestions.length; i += 500) {
    const chunk = formattedQuestions.slice(i, i + 500);
    const { data: insertedData, error } = await supabase
      .from('questions')
      .upsert(chunk, { onConflict: 'id' })
      .select();

    if (error) {
      console.error(`Error inserting batch ${i}:`, error.message);
      break; 
    } else {
      totalInserted += (insertedData?.length || 0);
      console.log(`Inserted batch ${i} to ${i + chunk.length}. Total so far: ${totalInserted}`);
    }
  }

  // Check what unique chapters were added
  const uniqueChapters = [...new Set(formattedQuestions.map(q => q.chapter))];
  const uniqueOriginal = [...new Set(batch.map(q => q.chapter))];
  console.log("Chapters involved:");
  uniqueOriginal.forEach((orig) => {
      console.log(`- ${orig} -> ${slugify(orig)}`);
  });
};

importData().catch(err => {
  console.error(err);
});
