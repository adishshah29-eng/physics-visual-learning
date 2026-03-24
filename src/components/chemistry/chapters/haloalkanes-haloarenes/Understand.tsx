import React from 'react';
import { getChapterById } from '../../../../data/chemistryChapters';
import ChemUnderstandTab from '../../ChemUnderstandTab';

const HaloalkanesHaloarenesUnderstand = () => {
  const chapter = getChapterById('haloalkanes-haloarenes');
  if (!chapter) return <div>Chapter not found</div>;
  
  return <ChemUnderstandTab chapter={chapter} />;
};

export default HaloalkanesHaloarenesUnderstand;
