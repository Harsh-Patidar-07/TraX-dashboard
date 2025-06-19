'use client'

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { fetchProgress, saveProgress, fetchOngoingChapters, saveOngoingChapters } from "@/lib/progressApi"
import { motion, AnimatePresence } from "framer-motion"
import { chapters as mathChapters } from "./subjects/mathematics/page"
import { chapters as physicsChapters } from "./subjects/physics/page"
import { chapters as chemistryChapters } from "./subjects/chemistry/page"

const mathChaptersTyped: { name: string; topics: string[] }[] = mathChapters;
const physicsChaptersTyped: { name: string; topics: string[] }[] = physicsChapters;
const chemistryChaptersTyped: { name: string; topics: string[] }[] = chemistryChapters;

const chapters = [
  {
    name: "Relations and Functions",
    topics: ["Ordered pairs", "Cartesian product", "Relations", "Functions", "Domain and Range", "Types of Functions"],
    subject: "Mathematics",
  },
  {
    name: "Matrices",
    topics: ["Matrix basics", "Types of matrices", "Matrix operations", "Determinants", "Inverse of a matrix", "Applications", "Properties"],
    subject: "Mathematics",
  },
]

export default function DashboardPage() {
  const [ongoing, setOngoing] = useState<{ subject: string, chapterIdx: number }[]>([])
  const [checkedTopics, setCheckedTopics] = useState<{ [key: string]: boolean[] }>({})
  const userId = "demo-user"

  useEffect(() => {
    async function loadOngoingAndProgress() {
      try {
        const [mathOngoing, physicsOngoing, chemistryOngoing, progress] = await Promise.all([
          fetchOngoingChapters(userId, 'mathematics'),
          fetchOngoingChapters(userId, 'physics'),
          fetchOngoingChapters(userId, 'chemistry'),
          fetchProgress(userId)
        ])
        // Build a combined ongoing list with subject info
        const mathArr = Array.isArray(mathOngoing) ? mathOngoing : [];
        const physicsArr = Array.isArray(physicsOngoing) ? physicsOngoing : [];
        const chemistryArr = Array.isArray(chemistryOngoing) ? chemistryOngoing : [];
        const ongoingList: Array<{ subject: string; chapterIdx: number }> = [];
        mathArr.forEach((idx: number) => ongoingList.push({ subject: 'mathematics', chapterIdx: idx }));
        physicsArr.forEach((idx: number) => ongoingList.push({ subject: 'physics', chapterIdx: idx }));
        chemistryArr.forEach((idx: number) => ongoingList.push({ subject: 'chemistry', chapterIdx: idx }));
        setOngoing(ongoingList)
        if (progress && progress.length > 0) {
          const progressMap: { [key: string]: boolean[] } = {}
          progress.forEach((row: any) => {
            const subject = row.subject || 'mathematics';
            const chaptersArr = getChaptersArray(subject);
            const topicsLength = chaptersArr[row.chapter_idx]?.topics.length || 0;
            let checked = Array.isArray(row.checked_topics)
              ? row.checked_topics.slice(0, topicsLength).concat(Array(topicsLength).fill(false)).slice(0, topicsLength)
              : Array(topicsLength).fill(false);
            progressMap[`${subject}-${row.chapter_idx}`] = checked;
          })
          setCheckedTopics(progressMap)
        }
      } catch (err) {
        console.error('Error loading progress or ongoing:', err)
      }
    }
    loadOngoingAndProgress()
  }, [])

  const getChaptersArray = (subject: string): { name: string; topics: string[] }[] => {
    if (subject === 'mathematics') return mathChaptersTyped;
    if (subject === 'physics') return physicsChaptersTyped;
    if (subject === 'chemistry') return chemistryChaptersTyped;
    return [];
  };

  const handleToggleTopic = (subject: string, chapterIdx: number, topicIdx: number) => {
    setCheckedTopics((prev) => {
      const key = `${subject}-${chapterIdx}`
      const chaptersArr = getChaptersArray(subject)
      const chapterChecks = prev[key] || Array(chaptersArr[chapterIdx].topics.length).fill(false)
      const newChecks = [...chapterChecks]
      newChecks[topicIdx] = !newChecks[topicIdx]
      saveProgress(userId, chapterIdx, newChecks).catch((err) => {
        console.error('Error saving progress:', err)
      })
      return { ...prev, [key]: newChecks }
    })
  }

  const isChapterCompleted = (subject: string, chapterIdx: number) => {
    const key = `${subject}-${chapterIdx}`
    const chaptersArr = getChaptersArray(subject)
    const checks = checkedTopics[key] || []
    return checks.length === chaptersArr[chapterIdx].topics.length && checks.every(Boolean)
  }

  const handleMarkCompleted = (subject: string, chapterIdx: number) => {
    const chaptersArr = getChaptersArray(subject);
    const allChecked = Array(chaptersArr[chapterIdx].topics.length).fill(true);
    setCheckedTopics((prev) => {
      saveProgress(userId, chapterIdx, allChecked).catch((err) => {
        console.error('Error saving progress:', err);
      });
      return { ...prev, [`${subject}-${chapterIdx}`]: allChecked };
    });
    // Remove from ongoing immediately for animation
    setOngoing((prev) =>
      prev.filter((item) => !(item.subject === subject && item.chapterIdx === chapterIdx))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Track your progress across all subjects
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-[oklch(0.645_0.246_16.439/0.1)] to-[oklch(0.704_0.191_22.216/0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[oklch(0.645_0.246_16.439/0.15)] to-transparent" />
          <div className="relative flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                />
                {/* Progress circle */}
                <circle
                  className="stroke-white"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray="264"
                  strokeDashoffset="66"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">75%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Mathematics</h3>
              <p className="text-sm text-muted-foreground">Current Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-[oklch(0.704_0.191_22.216/0.1)] to-[oklch(0.577_0.245_27.325/0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[oklch(0.704_0.191_22.216/0.15)] to-transparent" />
          <div className="relative flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                />
                {/* Progress circle */}
                <circle
                  className="stroke-white"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray="264"
                  strokeDashoffset="132"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">50%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Physics</h3>
              <p className="text-sm text-muted-foreground">Current Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-[oklch(0.577_0.245_27.325/0.1)] to-[oklch(0.645_0.246_16.439/0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[oklch(0.577_0.245_27.325/0.15)] to-transparent" />
          <div className="relative flex flex-col items-center space-y-4">
            <div className="relative h-32 w-32">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="stroke-white/10"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                />
                {/* Progress circle */}
                <circle
                  className="stroke-white"
                  strokeWidth="8"
                  fill="none"
                  cx="50"
                  cy="50"
                  r="42"
                  strokeDasharray="264"
                  strokeDashoffset="198"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">25%</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Chemistry</h3>
              <p className="text-sm text-muted-foreground">Current Progress</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Ongoing Chapters Section */}
      {ongoing.length > 0 ? (
        <div className="space-y-6 mt-10">
          <h3 className="text-2xl font-normal text-white mb-10 font-mono text-center">Ongoing Chapters</h3>
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {ongoing.map(({ subject, chapterIdx }) => {
                const chaptersArr = getChaptersArray(subject);
                if (!Array.isArray(chaptersArr) || !chaptersArr[chapterIdx]) return null;
                const chapter = chaptersArr[chapterIdx];
                return (
                  <motion.div
                    key={`${subject}-${chapter.name}`}
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Card className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-6 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10">
                      <div className="flex-1 flex flex-col gap-2 justify-center">
                        <span className="text-lg font-bold text-white/90">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                        <span className="text-2xl font-semibold text-white">{chapter.name}</span>
                        <ul className="pl-0 space-y-2 text-slate-200 mt-4">
                          {chapter.topics.map((topic: string, i: number) => (
                            <li key={topic} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="checkbox-circle"
                                id={`ongoing-topic-${subject}-${chapterIdx}-${i}`}
                                checked={!!checkedTopics[`${subject}-${chapterIdx}`]?.[i]}
                                onChange={() => handleToggleTopic(subject, chapterIdx, i)}
                              />
                              <label
                                htmlFor={`ongoing-topic-${subject}-${chapterIdx}-${i}`}
                                className={
                                  `cursor-pointer select-none transition-colors ${checkedTopics[`${subject}-${chapterIdx}`]?.[i] ? 'text-green-400' : 'text-white'}`
                                }
                              >
                                {topic}
                              </label>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-3 mt-2 justify-between items-center w-full">
                          <div className="flex gap-3">
                            <button
                              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow w-fit"
                              onClick={() => handleMarkCompleted(subject, chapterIdx)}
                            >
                              Mark as Completed
                            </button>
                          </div>
                          <button
                            className="px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white font-semibold transition-colors shadow w-fit"
                            onClick={() => {
                              setOngoing((prev) => {
                                const updated = prev.filter((item) => !(item.subject === subject && item.chapterIdx === chapterIdx));
                                // Update Supabase for this subject
                                const updatedIndices = updated
                                  .filter((item) => item.subject === subject)
                                  .map((item) => item.chapterIdx);
                                saveOngoingChapters(userId, subject, updatedIndices).catch(console.error);
                                return updated;
                              });
                            }}
                          >
                            Leave this
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="space-y-6 mt-10">
          <h3 className="text-2xl font-normal text-white mb-10 font-mono text-center">Ongoing Chapters</h3>
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            <span className="text-lg text-white/80">No ongoing chapters. Mark a chapter as ongoing from a subject page!</span>
          </div>
        </div>
      )}
    </div>
  )
}