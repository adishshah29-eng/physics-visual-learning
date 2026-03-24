import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const RedoxElectrochemistryUnderstand = () => {
  const chapter = getChapterById('redox-electrochemistry');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default RedoxElectrochemistryUnderstand;
