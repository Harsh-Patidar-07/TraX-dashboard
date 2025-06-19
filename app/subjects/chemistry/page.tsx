"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fetchProgress, saveProgress, fetchOngoingChapters, saveOngoingChapters } from "@/lib/progressApi";

export const chapters = [
  {
    name: "The Solid State",
    topics: [
      "Classification of solids based on different binding forces",
      "Unit cell in two dimensional and three dimensional lattices",
      "Calculation of density of unit cell",
      "Packing in solids",
      "Packing efficiency in cubic lattices",
      "Voids, number of atoms per unit cell",
      "Point defects in solids",
      "Electrical and magnetic properties",
      "Band theory of metals, conductors, semiconductors and insulators"
    ]
  },
  {
    name: "Solutions",
    topics: [
      "Types of solutions",
      "Expression of concentration of solutions",
      "Solubility of gases in liquids",
      "Solid solutions",
      "Colligative properties",
      "Relative lowering of vapour pressure",
      "Elevation of boiling point",
      "Depression of freezing point",
      "Osmotic pressure",
      "Determination of molecular masses using colligative properties",
      "Abnormal molecular mass"
    ]
  },
  {
    name: "Electrochemistry",
    topics: [
      "Redox reactions",
      "Conductance in electrolytic solutions",
      "Specific and molar conductivity",
      "Variations of conductivity with concentration",
      "Kohlrausch's law",
      "Electrolysis and laws of electrolysis",
      "Dry cell, electrochemical cells",
      "Lead accumulator, fuel cells",
      "Corrosion and its prevention"
    ]
  },
  {
    name: "Chemical Kinetics",
    topics: [
      "Rate of a reaction (average and instantaneous)",
      "Factors affecting rate of reaction",
      "Order and molecularity of a reaction",
      "Rate law and specific rate constant",
      "Integrated rate equations and half-life",
      "Concept of collision theory",
      "Activation energy and Arrhenius equation"
    ]
  },
  {
    name: "Surface Chemistry",
    topics: [
      "Adsorption - physisorption and chemisorption",
      "Factors affecting adsorption of gases on solids",
      "Catalysis - homogeneous and heterogeneous",
      "Activity and selectivity of solid catalysts",
      "Enzyme catalysis",
      "Colloidal state",
      "Distinction between true solutions, colloids and suspensions",
      "Properties of colloids",
      "Tyndall effect, Brownian movement, electrophoresis",
      "Coagulation and peptization",
      "Emulsions - types and properties"
    ]
  },
  {
    name: "General Principles and Processes of Isolation of Elements",
    topics: [
      "Principles and methods of extraction",
      "Concentration, oxidation, reduction",
      "Electrolytic method and refining",
      "Occurrence and principles of extraction of aluminium, copper, zinc and iron",
      "Thermodynamic principles of metallurgy",
      "Ellingham diagram"
    ]
  },
  {
    name: "The p-Block Elements",
    topics: [
      "Group 15 Elements:",
      "General introduction, electronic configuration",
      "Occurrence, oxidation states, trends in physical and chemical properties",
      "Nitrogen - preparation, properties and uses",
      "Compounds of nitrogen (ammonia, nitric acid)",
      "Phosphorus - allotropic forms, compounds of phosphorus",
      "Group 16 Elements:",
      "General introduction, electronic configuration, oxidation states",
      "Occurrence, trends in physical and chemical properties",
      "Dioxygen - preparation, properties and uses",
      "Classification of oxides",
      "Ozone preparation, properties, uses and ozone layer",
      "Sulphur - allotropic forms",
      "Compounds of sulphur (sulphur dioxide, sulphuric acid)",
      "Group 17 Elements:",
      "General introduction, electronic configuration, oxidation states",
      "Occurrence, trends in physical and chemical properties",
      "Compounds of halogens (preparation, properties and uses of chlorine and hydrochloric acid)",
      "Interhalogen compounds, oxoacids of halogens",
      "Group 18 Elements:",
      "General introduction, electronic configuration, occurrence",
      "Trends in physical and chemical properties, uses"
    ]
  },
  {
    name: "The d-Block and f-Block Elements",
    topics: [
      "Transition Elements:",
      "General introduction, electronic configuration, occurrence and characteristics",
      "General trends in properties of first row transition metals",
      "Metallic character, ionization enthalphy, oxidation states",
      "Ionic radii, colour, catalytic property, magnetic properties",
      "Interstitial compounds, alloy formation",
      "Preparation and properties of K₂Cr₂O₇ and KMnO₄",
      "Inner Transition Elements:",
      "Lanthanoids - electronic configuration, oxidation states, chemical reactivity",
      "Actinoids - electronic configuration, oxidation states",
      "Comparison of lanthanoids and actinoids"
    ]
  },
  {
    name: "Coordination Compounds",
    topics: [
      "Coordination compounds - introduction",
      "Ligands, coordination number, colour, magnetic properties and shapes",
      "IUPAC nomenclature of coordination compounds",
      "Bonding in coordination compounds",
      "Werner's theory, VBT, and CFT",
      "Bonding in metal carbonyls",
      "Stability of coordination compounds",
      "Importance and applications of coordination compounds"
    ]
  },
  {
    name: "Haloalkanes and Haloarenes",
    topics: [
      "Haloalkanes: nomenclature, nature of C-X bond, physical and chemical properties",
      "Optical rotation and chirality concepts",
      "Methods of preparation",
      "Reactions (nucleophilic substitution reactions)",
      "Haloarenes: nature of C-X bond, substitution reactions",
      "Uses and environmental effects of dichloromethane, trichloromethane, tetrachloromethane,",
      "iodoform, freons, DDT"
    ]
  },
  {
    name: "Alcohols, Phenols and Ethers",
    topics: [
      "Alcohols: nomenclature, methods of preparation, physical and chemical properties",
      "Primary, secondary and tertiary alcohols",
      "Identification of primary, secondary and tertiary alcohols",
      "Mechanism of dehydration",
      "Phenols: nomenclature, methods of preparation, physical and chemical properties",
      "Acidic nature of phenols, electrophilic substitution reactions",
      "Uses of phenols",
      "Ethers: nomenclature, methods of preparation, physical and chemical properties, uses"
    ]
  },
  {
    name: "Aldehydes, Ketones and Carboxylic Acids",
    topics: [
      "Aldehydes and Ketones: nomenclature, nature of carbonyl group",
      "Methods of preparation",
      "Physical and chemical properties",
      "Nucleophilic addition, reduction, oxidation, acidity of α-hydrogen",
      "Aldol condensation, Cannizzaro reaction",
      "Carboxylic Acids: nomenclature, acidic nature, methods of preparation",
      "Physical and chemical properties",
      "Uses of formic acid, acetic acid"
    ]
  },
  {
    name: "Amines",
    topics: [
      "Amines: nomenclature, classification, structure, methods of preparation",
      "Physical and chemical properties",
      "Uses, identification of primary, secondary and tertiary amines",
      "Cyanides and isocyanides - will be mentioned at relevant places",
      "Diazonium salts: preparation, chemical reactions and importance in synthetic organic chemistry"
    ]
  },
  {
    name: "Biomolecules",
    topics: [
      "Carbohydrates - classification (aldoses and ketoses, monosaccharides, disaccharides and polysaccharides)",
      "Glucose and fructose, sucrose, lactose, maltose, starch, cellulose, glycogen",
      "Proteins - elementary idea of α-amino acids, peptide bond, polypeptides",
      "Proteins structure - primary, secondary, tertiary and quaternary structures",
      "Denaturation of proteins, enzymes",
      "Vitamins - classification and functions",
      "Nucleic Acids: DNA and RNA"
    ]
  },
  {
    name: "Polymers",
    topics: [
      "Classification of polymers based on source and structure",
      "Types of polymerization (addition and condensation)",
      "Copolymerization",
      "Some important polymers with emphasis on their monomers and uses",
      "Natural and synthetic rubber",
      "Biodegradable and non-biodegradable polymers"
    ]
  },
  {
    name: "Chemistry in Everyday Life",
    topics: [
      "Chemicals in medicines - analgesics, tranquilizers, antiseptics, disinfectants",
      "Antimicrobials, antifertility drugs, antibiotics, antacids, antiseptics",
      "Chemicals in food - preservatives, artificial sweetening agents",
      "Elementary idea about antioxidants",
      "Cleansing agents - soaps and detergents, cleaning action"
    ]
  }
];

export default function ChemistryPage() {
  const [expandedChapter, setExpandedChapter] = useState<null | number>(null)
  const [checkedTopics, setCheckedTopics] = useState<{ [chapterIdx: number]: boolean[] }>({})
  const [ongoingChapters, setOngoingChaptersState] = useState<number[]>([])
  const [addingOngoing, setAddingOngoing] = useState<{ [idx: number]: boolean }>({});
  const userId = "demo-user";

  useEffect(() => {
    async function loadOngoingAndProgress() {
      try {
        const [ongoing, progress] = await Promise.all([
          fetchOngoingChapters(userId, 'chemistry'),
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
      saveOngoingChapters(userId, 'chemistry', updated).catch(console.error);
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
        saveOngoingChapters(userId, 'chemistry', filtered).catch(console.error);
      }
    }
  }, [checkedTopics]);

  return (
    <div className="min-h-screen py-12 px-4">
      <Card className="w-full max-w-7xl mx-auto mt-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col gap-10 border border-white/10">
        <div className="text-left">
          <h1 className="text-3xl font-normal tracking-tight mb-2 font-mono">Chemistry</h1>
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
  )
} 