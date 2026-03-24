import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const BasicConceptsUnderstand = () => {
  const chapter = getChapterById('basic-concepts');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default BasicConceptsUnderstand;
