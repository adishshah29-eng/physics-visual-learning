import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const BasicOrganicChemistryUnderstand = () => {
  const chapter = getChapterById('basic-organic-chemistry');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default BasicOrganicChemistryUnderstand;
