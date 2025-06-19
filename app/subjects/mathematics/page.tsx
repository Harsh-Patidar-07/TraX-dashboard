"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { fetchProgress, saveProgress, fetchOngoingChapters, saveOngoingChapters } from "@/lib/progressApi";

export const chapters = [
  {
    name: "Relations and Functions",
    topics: [
      "Types of relations (reflexive, symmetric, transitive)",
      "Equivalence relations",
      "Types of functions (one-one, onto, bijective)",
      "Composite functions",
      "Inverse of a function",
      "Binary operations and their properties"
    ]
  },
  {
    name: "Inverse Trigonometric Functions",
    topics: [
      "Definition and range of inverse trigonometric functions",
      "Domain and range of arcsine, arccosine, arctangent",
      "Principal values of inverse trigonometric functions",
      "Properties of inverse trigonometric functions",
      "Graphs of inverse trigonometric functions",
      "Elementary properties and simple identities"
    ]
  },
  {
    name: "Matrices",
    topics: [
      "Concept of matrix",
      "Types of matrices (row, column, square, diagonal, scalar, identity, zero)",
      "Operations on matrices (addition, multiplication, scalar multiplication)",
      "Transpose of a matrix",
      "Symmetric and skew-symmetric matrices",
      "Elementary operations on matrices",
      "Invertible matrices and inverse of a matrix"
    ]
  },
  {
    name: "Determinants",
    topics: [
      "Determinant of a square matrix (up to 3×3)",
      "Properties of determinants",
      "Minors and cofactors",
      "Adjoint of a matrix",
      "Inverse of a matrix using adjoint",
      "Applications of determinants (solving system of linear equations)",
      "Consistency and inconsistency of system of linear equations"
    ]
  },
  {
    name: "Continuity and Differentiability",
    topics: [
      "Continuity of a function at a point",
      "Continuity on an interval",
      "Differentiability of a function",
      "Derivatives of composite functions (chain rule)",
      "Derivatives of inverse trigonometric functions",
      "Derivatives of implicit functions",
      "Derivatives of exponential and logarithmic functions",
      "Logarithmic differentiation",
      "Derivatives of parametric functions",
      "Second order derivatives",
      "Rolle's theorem and Lagrange's mean value theorem"
    ]
  },
  {
    name: "Application of Derivatives",
    topics: [
      "Rate of change of quantities",
      "Increasing and decreasing functions",
      "Tangent and normal to a curve",
      "Maxima and minima (local and absolute)",
      "First derivative test",
      "Second derivative test",
      "Simple problems on optimization",
      "Approximations using differentials"
    ]
  },
  {
    name: "Integrals",
    topics: [
      "Integration as inverse process of differentiation",
      "Indefinite integrals and their properties",
      "Fundamental theorem of calculus",
      "Methods of integration:",
      "Integration by substitution",
      "Integration by parts",
      "Integration by partial fractions",
      "Integration of trigonometric functions",
      "Definite integrals and their properties",
      "Fundamental theorem of calculus",
      "Evaluation of definite integrals"
    ]
  },
  {
    name: "Application of Integrals",
    topics: [
      "Applications in finding area under curves",
      "Area between two curves",
      "Area of the region bounded by a curve and a line",
      "Simple applications in finding volumes of solids of revolution"
    ]
  },
  {
    name: "Differential Equations",
    topics: [
      "Definition, order, and degree of differential equations",
      "General and particular solutions",
      "Formation of differential equations",
      "Solution of differential equations by separation of variables",
      "Solution of homogeneous differential equations",
      "Solution of linear differential equations",
      "Applications of differential equations (growth and decay problems)"
    ]
  },
  {
    name: "Vector Algebra",
    topics: [
      "Vectors and scalars",
      "Addition and multiplication of vectors by scalars",
      "Position vector of a point",
      "Components of a vector",
      "Section formula",
      "Vector addition using components",
      "Scalar (dot) product of vectors",
      "Vector (cross) product of vectors",
      "Scalar triple product",
      "Applications of vectors in geometry"
    ]
  },
  {
    name: "Three Dimensional Geometry",
    topics: [
      "Direction cosines and direction ratios of a line",
      "Equation of a line in space",
      "Angle between two lines",
      "Shortest distance between two lines",
      "Equation of a plane",
      "Angle between line and plane",
      "Distance of a point from a plane",
      "Angle between two planes"
    ]
  },
  {
    name: "Linear Programming",
    topics: [
      "Introduction to linear programming",
      "Mathematical formulation of linear programming problem",
      "Graphical method of solution for problems in two variables",
      "Feasible and infeasible regions",
      "Feasible and infeasible solutions",
      "Optimal feasible solutions (up to three non-trivial constraints)"
    ]
  },
  {
    name: "Probability",
    topics: [
      "Conditional probability",
      "Multiplication theorem on probability",
      "Independent events",
      "Total probability",
      "Bayes' theorem",
      "Random variables and probability distributions",
      "Binomial distribution",
      "Mean and variance of binomial distribution"
    ]
  }
];

export default function MathematicsPage() {
  const [expandedChapter, setExpandedChapter] = useState<null | number>(null)
  const [checkedTopics, setCheckedTopics] = useState<{ [chapterIdx: number]: boolean[] }>({})
  const [ongoingChapters, setOngoingChaptersState] = useState<number[]>([])
  const [addingOngoing, setAddingOngoing] = useState<{ [idx: number]: boolean }>({});
  const userId = "demo-user";

  useEffect(() => {
    async function loadOngoingAndProgress() {
      try {
        const [ongoing, progress] = await Promise.all([
          fetchOngoingChapters(userId, 'mathematics'),
          fetchProgress(userId)
        ]);
        setOngoingChaptersState(ongoing || []);
        if (progress && progress.length > 0) {
          const progressMap: { [chapterIdx: number]: boolean[] } = {};
          progress.forEach((row: any) => {
            const topicsLength = chapters[row.chapter_idx]?.topics.length || 0;
            let checked = Array.isArray(row.checked_topics)
              ? row.checked_topics.slice(0, topicsLength).concat(Array(topicsLength).fill(false)).slice(0, topicsLength)
              : Array(topicsLength).fill(false);
            progressMap[row.chapter_idx] = checked;
          });
          setCheckedTopics(progressMap);
        }
      } catch (err) {
        console.error('Error loading progress or ongoing:', err);
      }
    }
    loadOngoingAndProgress();
  }, []);

  const handleToggleTopic = (chapterIdx: number, topicIdx: number) => {
    setCheckedTopics((prev) => {
      const chapterChecks = prev[chapterIdx] || Array(chapters[chapterIdx].topics.length).fill(false);
      const newChecks = [...chapterChecks];
      newChecks[topicIdx] = !newChecks[topicIdx];
      saveProgress(userId, chapterIdx, newChecks).catch((err) => {
        console.error('Error saving progress:', err);
      });
      return { ...prev, [chapterIdx]: newChecks };
    });
  };

  const handleMarkOngoing = async (idx: number) => {
    setAddingOngoing((prev) => ({ ...prev, [idx]: true }));
    setOngoingChaptersState((prev) => {
      let updated;
      if (prev.includes(idx)) {
        updated = [...prev];
      } else {
        updated = [...prev, idx];
      }
      saveOngoingChapters(userId, 'mathematics', updated).catch(console.error);
      return updated;
    });
    setTimeout(() => {
      setAddingOngoing((prev) => ({ ...prev, [idx]: false }));
    }, 1000);
  };

  const isChapterCompleted = (chapterIdx: number) => {
    const checks = checkedTopics[chapterIdx] || [];
    return checks.length === chapters[chapterIdx].topics.length && checks.every(Boolean);
  };

  useEffect(() => {
    if (ongoingChapters.length > 0) {
      const filtered = ongoingChapters.filter((chapterIdx) => !isChapterCompleted(chapterIdx));
      if (filtered.length !== ongoingChapters.length) {
        setOngoingChaptersState(filtered);
        saveOngoingChapters(userId, 'mathematics', filtered).catch(console.error);
      }
    }
  }, [checkedTopics]);

  return (
    <div className="min-h-screen py-12 px-4">
      <Card className="w-full max-w-7xl mx-auto mt-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-10 border border-white/10">
        {/* Hero Section */}
        <div className="text-left">
          <h1 className="text-3xl font-normal tracking-tight mb-2 font-mono">Mathematics</h1>
        </div>
        {/* Chapters Grid */}
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {chapters.map((chapter, idx) => {
            const checkedCount = checkedTopics[idx]?.filter(Boolean).length || 0;
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
                          checked={!!checkedTopics[idx]?.[i]}
                          onChange={() => handleToggleTopic(idx, i)}
                        />
                        <label
                          htmlFor={`topic-${idx}-${i}`}
                          className={
                            `cursor-pointer select-none transition-colors ${checkedTopics[idx]?.[i] ? 'text-green-400' : 'text-white'}`
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