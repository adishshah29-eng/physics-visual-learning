import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const AldehydesKetonesUnderstand = () => {
  const chapter = getChapterById('aldehydes-ketones');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default AldehydesKetonesUnderstand;
