import { Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TutorPanel from '@/components/common/TutorPanel';
import { getChapterById } from '@/config/chapters';

// Lazy-loaded simulations
const simulations = {
  'units': lazy(() => import('@/components/chapters/units/practice/playground/UnitConverter')),
  'kinematics-1d': lazy(() => import('@/components/chapters/Kinematics1d/Playground')),
  'projectile-motion': lazy(() => import('@/components/chapters/projectile/Playground')),
  'laws-of-motion': lazy(() => import('@/components/chapters/laws-of-motion/playgrounds/LawsOfMotionPlayground')),
  'work-energy': lazy(() => import('@/components/chapters/work-energy/Playground')),
  'circular-motion': lazy(() => import('@/components/chapters/circular-motion/Playground')),
  'shm': lazy(() => import('@/components/chapters/shm/Playground')),
  'rotational-motion': lazy(() => import('@/components/chapters/rotational-motion/Playground')),
};

// Units
import ExploreUnits from '@/components/chapters/units/Explore';
import UnderstandUnits from '@/components/chapters/units/Understand';
import PracticeUnits from '@/components/chapters/units/practice/PracticeTab';

// Kinematics 1D
import ExploreKinematics from '@/components/chapters/Kinematics1d/Explore';
import UnderstandKinematics from '@/components/chapters/Kinematics1d/Understand';
import PracticeKinematics from '@/components/chapters/Kinematics1d/practice/PracticeTab';

// Projectile Motion
import ExploreProjectile from '@/components/chapters/projectile/Explore';
import UnderstandProjectile from '@/components/chapters/projectile/Understand';
import PracticeProjectile from '@/components/chapters/projectile/practice/PracticeTab';

// Laws of Motion
import ExploreLaws from '@/components/chapters/laws-of-motion/Explore';
import UnderstandLaws from '@/components/chapters/laws-of-motion/Understand';
import PracticeLaws from '@/components/chapters/laws-of-motion/practice/PracticeTab';

// Work Energy Power
import ExploreWorkEnergy from '@/components/chapters/work-energy/Explore';
import UnderstandWorkEnergy from '@/components/chapters/work-energy/Understand';
import PracticeWorkEnergy from '@/components/chapters/work-energy/practice/PracticeTab';

// Circular Motion
import ExploreCircular from '@/components/chapters/circular-motion/Explore';
import UnderstandCircular from '@/components/chapters/circular-motion/Understand';
import PracticeCircular from '@/components/chapters/circular-motion/practice/PracticeTab';

// SHM
import ExploreSHM from '@/components/chapters/shm/Explore';
import UnderstandSHM from '@/components/chapters/shm/Understanding';
import PracticeSHM from '@/components/chapters/shm/practice/practiceTab';

// Rotational Motion
import ExploreRotational from '@/components/chapters/rotational-motion/Explore';
import UnderstandRotational from '@/components/chapters/rotational-motion/Understand';
import PracticeRotational from '@/components/chapters/rotational-motion/practice/PracticeTab';

const contentMap: Record<string, any> = {
  'units': {
    Explore: ExploreUnits,
    Understand: UnderstandUnits,
    Practice: PracticeUnits
  },
  'kinematics-1d': {
    Explore: ExploreKinematics,
    Understand: UnderstandKinematics,
    Practice: PracticeKinematics
  },
  'projectile-motion': {
    Explore: ExploreProjectile,
    Understand: UnderstandProjectile,
    Practice: PracticeProjectile
  },
  'laws-of-motion': {
    Explore: ExploreLaws,
    Understand: UnderstandLaws,
    Practice: PracticeLaws
  },
  'work-energy': {
    Explore: ExploreWorkEnergy,
    Understand: UnderstandWorkEnergy,
    Practice: PracticeWorkEnergy
  },
  'circular-motion': {
    Explore: ExploreCircular,
    Understand: UnderstandCircular,
    Practice: PracticeCircular
  },
  'shm': {
    Explore: ExploreSHM,
    Understand: UnderstandSHM,
    Practice: PracticeSHM
  },
  'rotational-motion': {
    Explore: ExploreRotational,
    Understand: UnderstandRotational,
    Practice: PracticeRotational
  },
};

const SimulationLoader = () => (
  <div className="flex flex-col items-center justify-center h-full
                  space-y-4 bg-slate-900/50">
    <svg className="animate-spin h-10 w-10 text-sky-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
           5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824
           3 7.938l3-2.647z" />
    </svg>
    <span className="text-sky-400 font-medium animate-pulse">
      Loading simulation...
    </span>
  </div>
);

export const ChapterPage = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = chapterId ? getChapterById(chapterId) : null;

  if (!chapter) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100
                      flex items-center justify-center
                      flex-col space-y-6">
        <h1 className="text-4xl font-bold text-slate-400">
          Chapter not found
        </h1>
        <Link to="/"
          className="text-sky-400 hover:text-sky-300
                     transition-colors flex items-center gap-2">
          <span>←</span> Back to Dashboard
        </Link>
      </div>
    );
  }

  const SimulationComponent =
    simulations[chapter.id as keyof typeof simulations] ||
    (() => (
      <div className="flex flex-col items-center justify-center
                      h-full space-y-3 text-slate-500">
        <span className="text-4xl">🚧</span>
        <p className="text-sm italic">
          Simulation for {chapter.title} is coming soon.
        </p>
      </div>
    ));

  const content = contentMap[chapter.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100
                    flex flex-col">
      <Navbar currentChapter={`${chapter.code}: ${chapter.title}`} />

      <main className="flex-1 pt-16 px-2 sm:px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4
                        min-h-[calc(100vh-4rem)] overflow-hidden">

          {/* Simulation - left 2/3 */}
          <div className="lg:col-span-2 border border-slate-800
                          rounded-xl overflow-y-auto bg-slate-900/20
                          backdrop-blur-sm shadow-2xl">
            <Suspense fallback={<SimulationLoader />}>
              <SimulationComponent />
            </Suspense>
          </div>

          {/* TutorPanel - right 1/3 */}
          <div className="lg:col-span-1 border border-slate-800
                          rounded-xl overflow-hidden bg-slate-900/20
                          backdrop-blur-sm shadow-2xl flex flex-col">
            <TutorPanel
              chapterTitle={chapter.title}
              Explore={
                content
                  ? <content.Explore />
                  : <div className="p-4 text-slate-500 text-sm">
                      Content coming soon.
                    </div>
              }
              Understand={
                content
                  ? <content.Understand />
                  : <div className="p-4 text-slate-500 text-sm">
                      Content coming soon.
                    </div>
              }
              Practice={
                content
                  ? <content.Practice />
                  : <div className="p-4 text-slate-500 text-sm">
                      Content coming soon.
                    </div>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};