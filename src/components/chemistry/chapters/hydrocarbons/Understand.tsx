import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const HydrocarbonsUnderstand = () => {
  const chapter = getChapterById('hydrocarbons');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default HydrocarbonsUnderstand;
