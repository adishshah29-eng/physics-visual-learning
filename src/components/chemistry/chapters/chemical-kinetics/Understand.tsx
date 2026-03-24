import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const ChemicalKineticsUnderstand = () => {
  const chapter = getChapterById('chemical-kinetics');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default ChemicalKineticsUnderstand;
