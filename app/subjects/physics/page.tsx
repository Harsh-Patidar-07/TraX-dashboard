"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchProgress, saveProgress, fetchOngoingChapters, saveOngoingChapters } from "@/lib/progressApi";

export const chapters = [
  {
    name: "Electric Charges and Fields",
    topics: [
      "Electric charge and its properties",
      "Coulomb's law",
      "Electric field and electric field lines",
      "Electric dipole and dipole moment",
      "Electric flux and Gauss's theorem",
      "Applications of Gauss's law"
    ]
  },
  {
    name: "Electrostatic Potential and Capacitance",
    topics: [
      "Electric potential and potential difference",
      "Relation between electric field and potential",
      "Equipotential surfaces",
      "Potential due to point charge and dipole",
      "Capacitors and capacitance",
      "Series and parallel combination of capacitors",
      "Energy stored in capacitor",
      "Dielectrics and polarization"
    ]
  },
  {
    name: "Current Electricity",
    topics: [
      "Electric current and drift velocity",
      "Ohm's law and resistance",
      "Resistivity and conductivity",
      "Temperature dependence of resistance",
      "Series and parallel combination of resistors",
      "Kirchhoff's laws",
      "Wheatstone bridge",
      "Potentiometer"
    ]
  },
  {
    name: "Moving Charges and Magnetism",
    topics: [
      "Magnetic force on moving charge",
      "Lorentz force",
      "Motion of charged particle in magnetic field",
      "Magnetic field due to current carrying conductor",
      "Biot-Savart law",
      "Ampere's circuital law",
      "Force between current carrying conductors",
      "Torque on current loop in magnetic field",
      "Moving coil galvanometer"
    ]
  },
  {
    name: "Magnetism and Matter",
    topics: [
      "Bar magnet and magnetic dipole moment",
      "Magnetic field lines",
      "Earth's magnetism",
      "Magnetic properties of materials",
      "Diamagnetism, paramagnetism, and ferromagnetism",
      "Hysteresis loop",
      "Permanent magnets and electromagnets"
    ]
  },
  {
    name: "Electromagnetic Induction",
    topics: [
      "Faraday's laws of electromagnetic induction",
      "Lenz's law",
      "Motional EMF",
      "Self-inductance and mutual inductance",
      "Energy stored in inductor",
      "AC generator and transformer"
    ]
  },
  {
    name: "Alternating Current",
    topics: [
      "AC voltage and current",
      "RMS and peak values",
      "AC circuits with resistor, inductor, and capacitor",
      "Series LCR circuit",
      "Resonance in AC circuits",
      "Power in AC circuits",
      "Power factor",
      "Transformer principle"
    ]
  },
  {
    name: "Electromagnetic Waves",
    topics: [
      "Maxwell's equations",
      "Electromagnetic spectrum",
      "Properties of electromagnetic waves",
      "Speed of electromagnetic waves",
      "Energy and momentum of EM waves"
    ]
  },
  {
    name: "Ray Optics and Optical Instruments",
    topics: [
      "Reflection and refraction of light",
      "Total internal reflection",
      "Refraction through prism",
      "Dispersion of light",
      "Spherical mirrors and lenses",
      "Lens formula and magnification",
      "Power of lens",
      "Optical instruments (microscope, telescope)",
      "Human eye and vision defects"
    ]
  },
  {
    name: "Wave Optics",
    topics: [
      "Huygens principle",
      "Interference of light",
      "Young's double slit experiment",
      "Coherent sources",
      "Diffraction of light",
      "Single slit diffraction",
      "Resolving power",
      "Polarization of light",
      "Malus law"
    ]
  },
  {
    name: "Dual Nature of Radiation and Matter",
    topics: [
      "Photoelectric effect",
      "Einstein's photoelectric equation",
      "Wave-particle duality",
      "De Broglie wavelength",
      "Davisson-Germer experiment"
    ]
  },
  {
    name: "Atoms",
    topics: [
      "Alpha particle scattering",
      "Rutherford's atomic model",
      "Bohr's atomic model",
      "Energy levels in hydrogen atom",
      "Line spectra of hydrogen"
    ]
  },
  {
    name: "Nuclei",
    topics: [
      "Nuclear composition",
      "Mass-energy relation",
      "Nuclear binding energy",
      "Radioactivity",
      "Alpha, beta, and gamma decay",
      "Nuclear fission and fusion",
      "Nuclear reactor"
    ]
  },
  {
    name: "Semiconductor Electronics",
    topics: [
      "Intrinsic and extrinsic semiconductors",
      "p-n junction",
      "p-n junction diode",
      "Zener diode",
      "Junction transistor",
      "Transistor as amplifier and switch",
      "Logic gates",
      "Digital electronics"
    ]
  },
  {
    name: "Communication Systems",
    topics: [
      "Elements of communication system",
      "Propagation of electromagnetic waves",
      "Modulation and demodulation",
      "Amplitude modulation",
      "Bandwidth and frequency range",
      "Digital communication"
    ]
  }
];

export default function PhysicsPage() {
  const [expandedChapter, setExpandedChapter] = useState<null | number>(null)
  const [checkedTopics, setCheckedTopics] = useState<{ [chapterIdx: number]: boolean[] }>({})
  const [ongoingChapters, setOngoingChaptersState] = useState<number[]>([])
  const [addingOngoing, setAddingOngoing] = useState<{ [idx: number]: boolean }>({});
  const userId = "demo-user";

  useEffect(() => {
    async function loadOngoingAndProgress() {
      try {
        const [ongoing, progress] = await Promise.all([
          fetchOngoingChapters(userId, 'physics'),
          fetchProgress(userId)
        ]);
        setOngoingChaptersState(ongoing || []);
        if (progress && progress.length > 0) {
          const progressMap: { [chapterIdx: number]: boolean[] } = {};
          progress.forEach((row: any) => {
            progressMap[row.chapter_idx] = row.checked_topics;
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
      saveOngoingChapters(userId, 'physics', updated).catch(console.error);
      return updated;
    });
    setTimeout(() => {
      setAddingOngoing((prev) => ({ ...prev, [idx]: false }));
    }, 1000);
  };

  // Helper to check if a chapter is completed
  const isChapterCompleted = (chapterIdx: number) => {
    const checks = checkedTopics[chapterIdx] || [];
    return checks.length === chapters[chapterIdx].topics.length && checks.every(Boolean);
  };

  // Remove completed chapters from ongoing
  useEffect(() => {
    if (ongoingChapters.length > 0) {
      const filtered = ongoingChapters.filter((chapterIdx) => !isChapterCompleted(chapterIdx));
      if (filtered.length !== ongoingChapters.length) {
        setOngoingChaptersState(filtered);
        saveOngoingChapters(userId, 'physics', filtered).catch(console.error);
      }
    }
  }, [checkedTopics]);

  // Mark all topics as completed for a chapter
  const handleMarkCompleted = (chapterIdx: number) => {
    const allChecked = Array(chapters[chapterIdx].topics.length).fill(true);
    setCheckedTopics((prev) => {
      saveProgress(userId, chapterIdx, allChecked).catch((err) => {
        console.error('Error saving progress:', err);
      });
      return { ...prev, [chapterIdx]: allChecked };
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <Card className="w-full max-w-7xl mx-auto mt-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-10 border border-white/10">
        <div className="text-left">
          <h1 className="text-3xl font-normal tracking-tight mb-2 font-mono">Physics</h1>
        </div>
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
  );
}