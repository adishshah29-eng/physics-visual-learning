// src/pages/ChemistryChapterPage.tsx
import type { ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChapterById } from '../data/chemistryChapters';
import TutorPanel from '@/components/common/TutorPanel';
import Navbar from '@/components/Navbar';
import ChemUnderstandTab from '../components/chemistry/ChemUnderstandTab';

// Per-chapter modules (Explore / Understand / Playground) — same pattern as physics `components/chapters/*`
import ExploreBasicConcepts from '@/components/chemistry/chapters/basic-concepts/Explore';
import UnderstandBasicConcepts from '@/components/chemistry/chapters/basic-concepts/Understand';
import PlaygroundBasicConcepts from '@/components/chemistry/chapters/basic-concepts/Playground';

import ExploreAtomicStructure from '@/components/chemistry/chapters/atomic-structure/Explore';
import UnderstandAtomicStructure from '@/components/chemistry/chapters/atomic-structure/Understand';
import PlaygroundAtomicStructure from '@/components/chemistry/chapters/atomic-structure/Playground';

import ExplorePeriodicTable from '@/components/chemistry/chapters/periodic-table/Explore';
import UnderstandPeriodicTable from '@/components/chemistry/chapters/periodic-table/Understand';
import PlaygroundPeriodicTable from '@/components/chemistry/chapters/periodic-table/Playground';

import ExploreChemicalBonding from '@/components/chemistry/chapters/chemical-bonding/Explore';
import UnderstandChemicalBonding from '@/components/chemistry/chapters/chemical-bonding/Understand';
import PlaygroundChemicalBonding from '@/components/chemistry/chapters/chemical-bonding/Playground';

import ExploreChemicalThermodynamics from '@/components/chemistry/chapters/chemical-thermodynamics/Explore';
import UnderstandChemicalThermodynamics from '@/components/chemistry/chapters/chemical-thermodynamics/Understand';
import PlaygroundChemicalThermodynamics from '@/components/chemistry/chapters/chemical-thermodynamics/Playground';

import ExploreSolutions from '@/components/chemistry/chapters/solutions/Explore';
import UnderstandSolutions from '@/components/chemistry/chapters/solutions/Understand';
import PlaygroundSolutions from '@/components/chemistry/chapters/solutions/Playground';

import ExploreEquilibrium from '@/components/chemistry/chapters/equilibrium/Explore';
import UnderstandEquilibrium from '@/components/chemistry/chapters/equilibrium/Understand';
import PlaygroundEquilibrium from '@/components/chemistry/chapters/equilibrium/Playground';

import ExploreRedoxElectrochemistry from '@/components/chemistry/chapters/redox-electrochemistry/Explore';
import UnderstandRedoxElectrochemistry from '@/components/chemistry/chapters/redox-electrochemistry/Understand';
import PlaygroundRedoxElectrochemistry from '@/components/chemistry/chapters/redox-electrochemistry/Playground';

import ExploreChemicalKinetics from '@/components/chemistry/chapters/chemical-kinetics/Explore';
import UnderstandChemicalKinetics from '@/components/chemistry/chapters/chemical-kinetics/Understand';
import PlaygroundChemicalKinetics from '@/components/chemistry/chapters/chemical-kinetics/Playground';

import ExploreBlockElementsS from '@/components/chemistry/chapters/block-elements-s/Explore';
import UnderstandBlockElementsS from '@/components/chemistry/chapters/block-elements-s/Understand';
import PlaygroundBlockElementsS from '@/components/chemistry/chapters/block-elements-s/Playground';

import ExploreBlockElementsP from '@/components/chemistry/chapters/block-elements-p/Explore';
import UnderstandBlockElementsP from '@/components/chemistry/chapters/block-elements-p/Understand';
import PlaygroundBlockElementsP from '@/components/chemistry/chapters/block-elements-p/Playground';

import ExploreBlockElementsD from '@/components/chemistry/chapters/block-elements-d/Explore';
import UnderstandBlockElementsD from '@/components/chemistry/chapters/block-elements-d/Understand';
import PlaygroundBlockElementsD from '@/components/chemistry/chapters/block-elements-d/Playground';

import ExploreMetallurgy from '@/components/chemistry/chapters/metallurgy/Explore';
import UnderstandMetallurgy from '@/components/chemistry/chapters/metallurgy/Understand';
import PlaygroundMetallurgy from '@/components/chemistry/chapters/metallurgy/Playground';

import ExploreBasicOrganicChemistry from '@/components/chemistry/chapters/basic-organic-chemistry/Explore';
import UnderstandBasicOrganicChemistry from '@/components/chemistry/chapters/basic-organic-chemistry/Understand';
import PlaygroundBasicOrganicChemistry from '@/components/chemistry/chapters/basic-organic-chemistry/Playground';

import ExploreHydrocarbons from '@/components/chemistry/chapters/hydrocarbons/Explore';
import UnderstandHydrocarbons from '@/components/chemistry/chapters/hydrocarbons/Understand';
import PlaygroundHydrocarbons from '@/components/chemistry/chapters/hydrocarbons/Playground';

import ExploreHaloalkanesHaloarenesR from '@/components/chemistry/chapters/haloalkanes-haloarenes/Explore';
import UnderstandHaloalkanesHaloarenesR from '@/components/chemistry/chapters/haloalkanes-haloarenes/Understand';
import PlaygroundHaloalkanesHaloarenesR from '@/components/chemistry/chapters/haloalkanes-haloarenes/Playground';

import ExploreAlcoholsPhenolsEthers from '@/components/chemistry/chapters/alcohols-phenols-ethers/Explore';
import UnderstandAlcoholsPhenolsEthers from '@/components/chemistry/chapters/alcohols-phenols-ethers/Understand';
import PlaygroundAlcoholsPhenolsEthers from '@/components/chemistry/chapters/alcohols-phenols-ethers/Playground';

import ExploreAldehydesKetones from '@/components/chemistry/chapters/aldehydes-ketones/Explore';
import UnderstandAldehydesKetones from '@/components/chemistry/chapters/aldehydes-ketones/Understand';
import PlaygroundAldehydesKetones from '@/components/chemistry/chapters/aldehydes-ketones/Playground';

import ExploreAmines from '@/components/chemistry/chapters/amines/Explore';
import UnderstandAmines from '@/components/chemistry/chapters/amines/Understand';
import PlaygroundAmines from '@/components/chemistry/chapters/amines/Playground';

import ExploreBiomoleculesPolymers from '@/components/chemistry/chapters/biomolecules-polymers/Explore';
import UnderstandBiomoleculesPolymers from '@/components/chemistry/chapters/biomolecules-polymers/Understand';
import PlaygroundBiomoleculesPolymers from '@/components/chemistry/chapters/biomolecules-polymers/Playground';

type ChapterModule = {
  Explore: ComponentType;
  Understand: ComponentType;
  Playground: ComponentType;
};

const contentMap: Record<string, ChapterModule> = {
  'basic-concepts': {
    Explore: ExploreBasicConcepts,
    Understand: UnderstandBasicConcepts,
    Playground: PlaygroundBasicConcepts,
  },
  'atomic-structure': {
    Explore: ExploreAtomicStructure,
    Understand: UnderstandAtomicStructure,
    Playground: PlaygroundAtomicStructure,
  },
  'periodic-table': {
    Explore: ExplorePeriodicTable,
    Understand: UnderstandPeriodicTable,
    Playground: PlaygroundPeriodicTable,
  },
  'chemical-bonding': {
    Explore: ExploreChemicalBonding,
    Understand: UnderstandChemicalBonding,
    Playground: PlaygroundChemicalBonding,
  },
  'chemical-thermodynamics': {
    Explore: ExploreChemicalThermodynamics,
    Understand: UnderstandChemicalThermodynamics,
    Playground: PlaygroundChemicalThermodynamics,
  },
  'solutions': {
    Explore: ExploreSolutions,
    Understand: UnderstandSolutions,
    Playground: PlaygroundSolutions,
  },
  'equilibrium': {
    Explore: ExploreEquilibrium,
    Understand: UnderstandEquilibrium,
    Playground: PlaygroundEquilibrium,
  },
  'redox-electrochemistry': {
    Explore: ExploreRedoxElectrochemistry,
    Understand: UnderstandRedoxElectrochemistry,
    Playground: PlaygroundRedoxElectrochemistry,
  },
  'chemical-kinetics': {
    Explore: ExploreChemicalKinetics,
    Understand: UnderstandChemicalKinetics,
    Playground: PlaygroundChemicalKinetics,
  },
  'block-elements-s': {
    Explore: ExploreBlockElementsS,
    Understand: UnderstandBlockElementsS,
    Playground: PlaygroundBlockElementsS,
  },
  'block-elements-p': {
    Explore: ExploreBlockElementsP,
    Understand: UnderstandBlockElementsP,
    Playground: PlaygroundBlockElementsP,
  },
  'block-elements-d': {
    Explore: ExploreBlockElementsD,
    Understand: UnderstandBlockElementsD,
    Playground: PlaygroundBlockElementsD,
  },
  'metallurgy': {
    Explore: ExploreMetallurgy,
    Understand: UnderstandMetallurgy,
    Playground: PlaygroundMetallurgy,
  },
  'basic-organic-chemistry': {
    Explore: ExploreBasicOrganicChemistry,
    Understand: UnderstandBasicOrganicChemistry,
    Playground: PlaygroundBasicOrganicChemistry,
  },
  'hydrocarbons': {
    Explore: ExploreHydrocarbons,
    Understand: UnderstandHydrocarbons,
    Playground: PlaygroundHydrocarbons,
  },
  'haloalkanes-haloarenes': {
    Explore: ExploreHaloalkanesHaloarenesR,
    Understand: UnderstandHaloalkanesHaloarenesR,
    Playground: PlaygroundHaloalkanesHaloarenesR,
  },
  'alcohols-phenols-ethers': {
    Explore: ExploreAlcoholsPhenolsEthers,
    Understand: UnderstandAlcoholsPhenolsEthers,
    Playground: PlaygroundAlcoholsPhenolsEthers,
  },
  'aldehydes-ketones': {
    Explore: ExploreAldehydesKetones,
    Understand: UnderstandAldehydesKetones,
    Playground: PlaygroundAldehydesKetones,
  },
  'amines': {
    Explore: ExploreAmines,
    Understand: UnderstandAmines,
    Playground: PlaygroundAmines,
  },
  'biomolecules-polymers': {
    Explore: ExploreBiomoleculesPolymers,
    Understand: UnderstandBiomoleculesPolymers,
    Playground: PlaygroundBiomoleculesPolymers,
  },
};

export default function ChemistryChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const chapter = getChapterById(chapterId ?? '');

  if (!chapter) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Chapter not found.{' '}
        <button onClick={() => navigate('/chemistry')} className="ml-2 underline text-sky-400">
          Go back
        </button>
      </div>
    );
  }

  const content = contentMap[chapter.id];

  const PlaygroundComponent = content?.Playground;
  const ExploreComponent = content?.Explore;
  const UnderstandComponent = content?.Understand;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar currentChapter={`Unit ${chapter.unit}: ${chapter.title}`} />
      
      <main className="flex-1 pt-16 px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[calc(100vh-4rem)]">
          {/* Simulation - left 2/3 */}
          <div className="lg:col-span-2 min-h-[400px] border border-slate-800 rounded-xl overflow-y-auto bg-slate-900/20 backdrop-blur-sm shadow-2xl">
            {PlaygroundComponent ? (
              <div className="p-4 sm:p-6 overflow-x-hidden">
                <PlaygroundComponent />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-slate-500">
                <span className="text-4xl">🚧</span>
                <p className="text-sm italic">Visualization for {chapter.title} is coming soon.</p>
              </div>
            )}
          </div>

          {/* TutorPanel - right 1/3 */}
          <div className="lg:col-span-1 min-h-[500px] border border-slate-800 rounded-xl overflow-hidden bg-slate-900/20 backdrop-blur-sm shadow-2xl flex flex-col">
            <TutorPanel
              chapterTitle={chapter.title}
              Explore={
                ExploreComponent ? (
                  <ExploreComponent />
                ) : (
                  <div className="p-4 text-slate-500 text-sm">Explore content coming soon.</div>
                )
              }
              Understand={
                UnderstandComponent ? (
                  <UnderstandComponent />
                ) : (
                  <ChemUnderstandTab chapter={chapter} />
                )
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}
