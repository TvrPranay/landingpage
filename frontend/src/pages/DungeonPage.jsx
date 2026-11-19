import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DungeonHub from '../components/DungeonHub';
import DungeonChapterView from '../components/DungeonChapterView';
import DungeonIDEView from '../components/DungeonIDEView';
import { DUNGEON_CHAPTERS } from '../data/dungeonData';

export default function DungeonPage() {
  const { currentRoute, navigate, awardXp, triggerToast } = useApp();
  const { query } = currentRoute;

  // Active query parameters: chapter and problem
  const activeChapterId = query.chapter ? Number(query.chapter) : null;
  const activeProblemId = query.problem ? Number(query.problem) : null;

  // Persisted Solved Problem IDs
  // Initialize with [1, 2, 5, 6, 7, 8, 9, 10] (8 solved problems) to match the reference screenshot (8 / 12, 66%)
  const [solvedProblemIds, setSolvedProblemIds] = useState(() => {
    try {
      const saved = localStorage.getItem('teklozyDungeonSolved');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default initial 8 solved problems matching Chapter 1 reference
    const defaultSolved = [1, 2, 5, 6, 7, 8, 9, 10];
    localStorage.setItem('teklozyDungeonSolved', JSON.stringify(defaultSolved));
    return defaultSolved;
  });

  // Calculate unlocked chapters dynamically
  const [unlockedChapterIds, setUnlockedChapterIds] = useState(() => {
    try {
      const saved = localStorage.getItem('teklozyDungeonUnlockedChapters');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [1]; // Chapter 1 unlocked by default
  });

  // Check and unlock subsequent chapters whenever solved problems update
  useEffect(() => {
    let unlocked = [1];
    for (let i = 0; i < DUNGEON_CHAPTERS.length - 1; i++) {
      const ch = DUNGEON_CHAPTERS[i];
      const solvedInCh = ch.problems.filter(p => solvedProblemIds.includes(p.id)).length;
      if (solvedInCh >= ch.requiredProblemsToUnlockNext) {
        unlocked.push(DUNGEON_CHAPTERS[i + 1].id);
      }
    }
    setUnlockedChapterIds(unlocked);
    localStorage.setItem('teklozyDungeonUnlockedChapters', JSON.stringify(unlocked));
  }, [solvedProblemIds]);

  // Handle problem solved successfully in IDE
  const handleSolveSuccess = (probId, xpAward) => {
    setSolvedProblemIds(prev => {
      if (prev.includes(probId)) return prev;
      const updated = [...prev, probId];
      localStorage.setItem('teklozyDungeonSolved', JSON.stringify(updated));
      return updated;
    });

    if (xpAward > 0) {
      awardXp(xpAward);
    }
  };

  // Navigation Handlers
  const handleOpenChapter = (chapId) => {
    navigate('dungeon', { chapter: chapId });
  };

  const handleSelectProblem = (chapId, probId) => {
    navigate('dungeon', { chapter: chapId, problem: probId });
  };

  const handleBackToHub = () => {
    navigate('dungeon');
  };

  const handleBackToChapter = () => {
    if (activeChapterId) {
      navigate('dungeon', { chapter: activeChapterId });
    } else {
      navigate('dungeon');
    }
  };

  // Continue Quest button handler: finds next unfinished problem across all unlocked chapters
  const handleContinueQuest = () => {
    for (const chId of unlockedChapterIds) {
      const ch = DUNGEON_CHAPTERS.find(c => c.id === chId);
      if (ch) {
        const nextUnsolved = ch.problems.find(p => !solvedProblemIds.includes(p.id));
        if (nextUnsolved) {
          navigate('dungeon', { chapter: ch.id, problem: nextUnsolved.id });
          return;
        }
      }
    }
    // Fallback to Chapter 1, problem 1
    navigate('dungeon', { chapter: 1, problem: 1 });
  };

  const handleGoBackFromHub = () => {
    // Return to Level 2 milestone or Home
    navigate('level/2');
  };

  // Render View C: Interactive Problem Solving IDE
  if (activeProblemId && activeChapterId) {
    return (
      <DungeonIDEView
        chapterId={activeChapterId}
        problemId={activeProblemId}
        onBackToChapter={handleBackToChapter}
        onSolveSuccess={handleSolveSuccess}
        isSolvedInitially={solvedProblemIds.includes(activeProblemId)}
        triggerToast={triggerToast}
      />
    );
  }

  // Render View B: Topic Chapter View
  if (activeChapterId) {
    return (
      <DungeonChapterView
        chapterId={activeChapterId}
        solvedProblemIds={solvedProblemIds}
        unlockedChapterIds={unlockedChapterIds}
        onSelectProblem={handleSelectProblem}
        onSwitchChapter={handleOpenChapter}
        onBackToHub={handleBackToHub}
        triggerToast={triggerToast}
      />
    );
  }

  // Render View A: DSA Dungeon Hub / Map Screen
  return (
    <DungeonHub
      solvedProblemIds={solvedProblemIds}
      unlockedChapterIds={unlockedChapterIds}
      onOpenChapter={handleOpenChapter}
      onContinueQuest={handleContinueQuest}
      onGoBack={handleGoBackFromHub}
      triggerToast={triggerToast}
    />
  );
}
