import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const EquilibriumUnderstand = () => {
  const chapter = getChapterById('equilibrium');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default EquilibriumUnderstand;
