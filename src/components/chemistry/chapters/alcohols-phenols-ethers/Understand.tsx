import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const AlcoholsPhenolsEthersUnderstand = () => {
  const chapter = getChapterById('alcohols-phenols-ethers');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default AlcoholsPhenolsEthersUnderstand;
