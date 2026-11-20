import React from 'react';
import { useApp } from '../context/AppContext';
import { StageFrame } from '../components/stage/StageScene';
import StageScene from '../components/stage/StageScene';
import { StageCTA, StageHeroIcon, StageModuleList, StageProgressCard } from '../components/stage/StageParts';
import { stageNextMarkers, stageScene } from '../utils/journey';
import { Code2, ArrowRight, BrainCircuit, Trophy } from 'lucide-react';

const LEVEL1_ART = stageScene(1);
const LEVEL1_MARKERS = stageNextMarkers(1);

export default function LevelOnePage() {
  const { navigate, milestones } = useApp();

  // Learning modules exactly matching user Reference Image 2 & Image 3
  const modules = [
    {
      key: 'welcome',
      position: 1,
      title: 'Welcome to Teklozy',
      description: 'Get familiar with the platform and your journey',
      meta: 'Done',
      state: 'done',
      lessonModuleIndex: 0
    },
    {
      key: 'profile_setup',
      position: 2,
      title: 'Set Up Your Developer Profile',
      description: 'Create your profile and personalise your path',
      meta: '8 min',
      state: 'next',
      lessonModuleIndex: 1
    },
    {
      key: 'path_exploration',
      position: 3,
      title: 'Explore the Learning Paths',
      description: 'Understand the 10–level journey and key outcomes',
      meta: '7 min',
      state: 'open',
      lessonModuleIndex: 2
    },
    {
      key: 'career_planning',
      position: 4,
      title: 'Plan Your Tech Career',
      description: 'Set your goals and unlock the next level',
      meta: '10 min',
      state: 'open',
      lessonModuleIndex: 3
    }
  ];

  // User requirement: "and see if they click on 3rd image it should redirect to learning page"
  // Clicking any module item redirects to the learning page for that module!
  const handleOpenModule = (mod) => {
    navigate('lesson', { module: mod.lessonModuleIndex, tab: 'About' });
  };

  // Clicking "Continue Learning" redirects directly to the learning page!
  const handleContinueLearning = () => {
    navigate('lesson', { module: 1, tab: 'About' });
  };

  const rows = modules.map((m) => ({
    key: m.key,
    position: m.position,
    title: m.title,
    description: m.description,
    meta: m.meta,
    state: m.state,
    onClick: () => handleOpenModule(m)
  }));

  const overview = (
    <>
      <StageProgressCard level={1} percent={25} done={1} total={4} />
      <StageModuleList rows={rows} busy={false} />
      <StageCTA
        label="Continue Learning"
        busy={false}
        done={false}
        onClick={handleContinueLearning}
      />
    </>
  );

  const resources = (
    <div className="l1-resources-box">
      <h2 className="l1-h2">Discover Resources</h2>
      <ul className="l1-links">
        <li>
          <button type="button" onClick={() => navigate('lesson', { module: 0 })}>
            <Code2 size={20} />
            <span>
              <strong>Core Curriculum</strong>
              <small>Open active video & interactive lessons</small>
            </span>
            <ArrowRight size={18} />
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigate('dungeon')}>
            <BrainCircuit size={20} />
            <span>
              <strong>DSA Dungeon</strong>
              <small>Practice problem-solving quest</small>
            </span>
            <ArrowRight size={18} />
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigate('challenges')}>
            <Trophy size={20} />
            <span>
              <strong>Discover Challenges</strong>
              <small>Test knowledge with quick quizzes</small>
            </span>
            <ArrowRight size={18} />
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <StageFrame>
      <StageScene
        level={1}
        art={LEVEL1_ART}
        markers={LEVEL1_MARKERS}
        title="Discover"
        pill="Level 1 of 10"
        desc="Start your journey in tech. Explore the platform, set up your path, and build a strong foundation for what's ahead."
        heroIcon={<StageHeroIcon level={1} />}
        overview={overview}
        resources={resources}
      />
    </StageFrame>
  );
}
