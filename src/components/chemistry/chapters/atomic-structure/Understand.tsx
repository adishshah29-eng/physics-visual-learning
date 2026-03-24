import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const AtomicStructureUnderstand = () => {
  const chapter = getChapterById('atomic-structure');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default AtomicStructureUnderstand;
