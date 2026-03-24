import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const BiomoleculesUnderstand = () => {
  const chapter = getChapterById('biomolecules-polymers');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default BiomoleculesUnderstand;
