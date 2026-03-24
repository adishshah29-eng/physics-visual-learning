import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const ChemicalThermodynamicsUnderstand = () => {
  const chapter = getChapterById('chemical-thermodynamics');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default ChemicalThermodynamicsUnderstand;
