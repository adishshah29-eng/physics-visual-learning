import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const ChemicalBondingUnderstand = () => {
  const chapter = getChapterById('chemical-bonding');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default ChemicalBondingUnderstand;
