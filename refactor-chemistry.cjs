const fs = require('fs');
const path = require('path');

const chemistryDir = path.join(__dirname, 'src', 'components', 'chemistry');
const chaptersDir = path.join(chemistryDir, 'chapters');

const chapters = fs.readdirSync(chaptersDir).filter(f => fs.statSync(path.join(chaptersDir, f)).isDirectory());

// We also need to fix ChemUnderstandTab.tsx because it probably imports from `./`
const chemUnderstandTabPath = path.join(chemistryDir, 'understand', 'ChemUnderstandTab.tsx');
let chemUnderstandTabContent = '';
if (fs.existsSync(chemUnderstandTabPath)) {
  chemUnderstandTabContent = fs.readFileSync(chemUnderstandTabPath, 'utf8');
}

for (const chapter of chapters) {
  const chapterPath = path.join(chaptersDir, chapter);
  const playgroundFile = path.join(chapterPath, 'Playground.tsx');
  const understandFile = path.join(chapterPath, 'Understand.tsx');
  
  // Read playground placeholder
  if (fs.existsSync(playgroundFile)) {
    const content = fs.readFileSync(playgroundFile, 'utf8');
    const match = content.match(/from\s+['"]\.\.\/\.\.\/explore\/(.+)['"]/);
    if (match) {
      const sourceName = match[1] + '.tsx';
      const sourcePath = path.join(chemistryDir, 'explore', sourceName);
      if (fs.existsSync(sourcePath)) {
        let sourceContent = fs.readFileSync(sourcePath, 'utf8');
        sourceContent = sourceContent.replace(/from\s+['"](\.\.\/[^'"]+)['"]/g, "from '../$1'");
        
        fs.writeFileSync(playgroundFile, sourceContent);
        fs.unlinkSync(sourcePath);
        console.log(`Moved ${sourceName} to ${chapter}/Playground.tsx`);
      }
    }
  }

  // Read understand placeholder
  if (fs.existsSync(understandFile)) {
    const content = fs.readFileSync(understandFile, 'utf8');
    const match = content.match(/from\s+['"]\.\.\/\.\.\/understand\/(.+)['"]/);
    if (match) {
      const sourceName = match[1] + '.tsx';
      const sourcePath = path.join(chemistryDir, 'understand', sourceName);
      if (fs.existsSync(sourcePath)) {
        let sourceContent = fs.readFileSync(sourcePath, 'utf8');
        sourceContent = sourceContent.replace(/from\s+['"](\.\.\/[^'"]+)['"]/g, "from '../$1'");
        
        fs.writeFileSync(understandFile, sourceContent);
        fs.unlinkSync(sourcePath);
        console.log(`Moved ${sourceName} to ${chapter}/Understand.tsx`);
        
        // Update ChemUnderstandTab.tsx to import from chapters/ instead of ./
        chemUnderstandTabContent = chemUnderstandTabContent.replace(
          new RegExp(`from\\s+['"]\\.\\/${match[1]}['"]`),
          `from './chapters/${chapter}/Understand'`
        );
      }
    }
  }
}

if (chemUnderstandTabContent) {
  const newTabPath = path.join(chemistryDir, 'ChemUnderstandTab.tsx');
  fs.writeFileSync(newTabPath, chemUnderstandTabContent);
  fs.unlinkSync(chemUnderstandTabPath);
  console.log(`Moved ChemUnderstandTab.tsx to ${newTabPath}`);
}

const chapterPagePath = path.join(__dirname, 'src', 'pages', 'ChemistryChapterPage.tsx');
if (fs.existsSync(chapterPagePath)) {
  let pContent = fs.readFileSync(chapterPagePath, 'utf8');
  pContent = pContent.replace(/import ChemUnderstandTab from '\.\.\/components\/chemistry\/understand\/ChemUnderstandTab';/g, "import ChemUnderstandTab from '../components/chemistry/ChemUnderstandTab';");
  pContent = pContent.replace(/import ChemUnderstandTab from ["']@\/components\/chemistry\/understand\/ChemUnderstandTab["'];/g, "import ChemUnderstandTab from '@/components/chemistry/ChemUnderstandTab';");
  fs.writeFileSync(chapterPagePath, pContent);
  console.log('Updated ChemistryChapterPage.tsx');
}

try {
  fs.rmdirSync(path.join(chemistryDir, 'explore'));
  fs.rmdirSync(path.join(chemistryDir, 'understand'));
  console.log('Removed empty explore and understand directories');
} catch (e) {
  console.log('Could not remove dirs:', e.message);
}
