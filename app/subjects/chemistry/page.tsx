"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchProgress, saveProgress, fetchOngoingChapters, saveOngoingChapters } from "@/lib/progressApi";
import { chapters } from "./chapters";
import { useSupabaseUser } from "@/hooks/use-supabase-user";

export default function ChemistryPage() {
  const { user, loading } = useSupabaseUser();
  const [expandedChapter, setExpandedChapter] = useState<null | number>(null)
  const [checkedTopics, setCheckedTopics] = useState<{ [key: string]: boolean[] }>({})
  const [ongoingChapters, setOngoingChaptersState] = useState<number[]>([])
  const [addingOngoing, setAddingOngoing] = useState<{ [idx: number]: boolean }>({});
  const subject = 'chemistry';
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    async function loadOngoingAndProgress() {
      try {
        const [ongoing, progress] = await Promise.all([
          fetchOngoingChapters(userId!, 'chemistry'),
          fetchProgress(userId!, 'chemistry')
        ]);
        setOngoingChaptersState(ongoing || []);
        if (progress && progress.length > 0) {
          const progressMap: { [key: string]: boolean[] } = {};
          progress.forEach((row: any) => {
            progressMap[`chemistry-${row.chapter_idx}`] = row.checked_topics;
          });
          setCheckedTopics(progressMap);
        }
      } catch (err) {
        console.error('Error loading progress or ongoing:', err);
      }
    }
    loadOngoingAndProgress();
  }, [userId]);

  function showLoginPrompt() {
    alert('Please log in to use this feature.');
  }

  const handleToggleTopic = (chapterIdx: number, topicIdx: number) => {
    if (!userId) return showLoginPrompt();
    setCheckedTopics((prev) => {
      const key = `${subject}-${chapterIdx}`;
      const chapterChecks = prev[key] || Array(chapters[chapterIdx].topics.length).fill(false);
      const newChecks = [...chapterChecks];
      newChecks[topicIdx] = !newChecks[topicIdx];
      saveProgress(userId!, subject, chapterIdx, newChecks).catch((err) => {
        console.error('Error saving progress:', err);
      });
      return { ...prev, [key]: newChecks };
    });
  };

  const handleMarkOngoing = async (idx: number) => {
    if (!userId) return showLoginPrompt();
    setAddingOngoing((prev) => ({ ...prev, [idx]: true }));
    setOngoingChaptersState((prev) => {
      let updated;
      if (prev.includes(idx)) {
        updated = [...prev];
      } else {
        updated = [...prev, idx];
      }
      saveOngoingChapters(userId!, 'chemistry', updated).catch(console.error);
      return updated;
    });
    setTimeout(() => {
      setAddingOngoing((prev) => ({ ...prev, [idx]: false }));
    }, 1000);
  };

  // Helper to check if a chapter is completed
  const isChapterCompleted = (chapterIdx: number) => {
    const key = `${subject}-${chapterIdx}`;
    const checks = checkedTopics[key] || [];
    return checks.length === chapters[chapterIdx].topics.length && checks.every(Boolean);
  };

  // Remove completed chapters from ongoing
  useEffect(() => {
    if (ongoingChapters.length > 0) {
      const filtered = ongoingChapters.filter((chapterIdx) => !isChapterCompleted(chapterIdx));
      if (filtered.length !== ongoingChapters.length) {
        setOngoingChaptersState(filtered);
        saveOngoingChapters(userId!, 'chemistry', filtered).catch(console.error);
      }
    }
  }, [checkedTopics]);

  const handleMarkCompleted = (chapterIdx: number) => {
    if (!userId) return showLoginPrompt();
    const allChecked = Array(chapters[chapterIdx].topics.length).fill(true);
    setCheckedTopics((prev) => {
      const key = `${subject}-${chapterIdx}`;
      saveProgress(userId!, subject, chapterIdx, allChecked).catch((err) => {
        console.error('Error saving progress:', err);
      });
      return { ...prev, [key]: allChecked };
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen py-12 px-4">
      <Card className="w-full max-w-7xl mx-auto mt-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-10 border border-white/10">
        <div className="text-left">
          <h1 className="text-3xl font-normal tracking-tight mb-2 font-tektur">Chemistry</h1>
        </div>
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {chapters.map((chapter, idx) => {
            const checkedCount = checkedTopics[`${subject}-${idx}`]?.filter(Boolean).length || 0;
            const percent = Math.round((checkedCount / chapter.topics.length) * 100);
            const isExpanded = expandedChapter === idx;
            return (
              <Card key={chapter.name} className="relative rounded-2xl bg-black shadow-xl p-7 flex flex-col gap-4 border border-white/10 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-2xl text-white/90">{chapter.name}</span>
                  <Button
                    variant="secondary"
                    className="w-fit ml-4"
                    onClick={() => setExpandedChapter(isExpanded ? null : idx)}
                  >
                    {isExpanded ? "Hide Topics" : "View Topics"}
                  </Button>
                </div>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{checkedCount}/{chapter.topics.length} topics</span>
                  <span className="font-semibold text-white/80">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {isExpanded && (
                  <ul className="pl-0 space-y-2 text-slate-200 mt-4 transition-all duration-300">
                    {chapter.topics.map((topic, i) => (
                      <li key={topic} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="checkbox-circle"
                          id={`topic-${idx}-${i}`}
                          checked={!!checkedTopics[`${subject}-${idx}`]?.[i]}
                          onChange={() => handleToggleTopic(idx, i)}
                        />
                        <label
                          htmlFor={`topic-${idx}-${i}`}
                          className={
                            `cursor-pointer select-none transition-colors ${checkedTopics[`${subject}-${idx}`]?.[i] ? 'text-green-400' : 'text-white'}`
                          }
                        >
                          {topic}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-3 mt-2">
                  <Button 
                    style={{ background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)', color: '#fff' }}
                    className="w-fit"
                    onClick={() => setExpandedChapter(isExpanded ? null : idx)}
                  >
                    {isExpanded ? "Hide Topics" : "View Topics"}
                  </Button>
                  <Button 
                    variant="secondary"
                    className="w-fit"
                    onClick={() => handleMarkOngoing(idx)}
                    disabled={addingOngoing[idx]}
                  >
                    {addingOngoing[idx] ? (
                      <span className="flex items-center gap-2 text-green-400">✔ Added!</span>
                    ) : (
                      "Mark as Ongoing"
                    )}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </Card>
    </div>
  )
} 