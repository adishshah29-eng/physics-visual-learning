// src/data/chemistryChapters.ts

export interface Topic {
  title: string;
  subtopics: string[];
}

export interface ChemistryChapter {
  id: string;
  unit: number;
  title: string;
  description: string;
  category: 'physical' | 'inorganic' | 'organic';
  icon: string;
  color: string;
  hasVisualization: boolean;
  topics: Topic[];
}

export const chemistryChapters: ChemistryChapter[] = [
  // ─── PHYSICAL CHEMISTRY ───────────────────────────────────────────
  {
    id: 'basic-concepts',
    unit: 1,
    title: 'Basic Concepts of Chemistry',
    description: 'Mole concept, stoichiometry, laws of chemical combination.',
    category: 'physical',
    icon: '⚗️',
    color: '#10b981',
    hasVisualization: true,
    topics: [
      {
        title: 'Mole Concept',
        subtopics: [
          "Avogadro's number (6.022 × 10²³)",
          'Molar mass and gram-molecular mass',
          'Mole–mass–number conversions',
          'Volume at STP (22.4 L/mol for ideal gas)',
        ],
      },
      {
        title: 'Laws of Chemical Combination',
        subtopics: [
          'Law of Conservation of Mass',
          'Law of Definite Proportions',
          'Law of Multiple Proportions',
          "Avogadro's Law",
          "Gay-Lussac's Law of Gaseous Volumes",
        ],
      },
      {
        title: 'Stoichiometry',
        subtopics: [
          'Balancing chemical equations',
          'Limiting reagent and excess reagent',
          'Percentage yield and theoretical yield',
          'Empirical and molecular formula determination',
        ],
      },
      {
        title: 'Atomic and Molecular Masses',
        subtopics: [
          'Atomic mass unit (amu)',
          'Average atomic mass from isotopes',
          'Molecular and formula mass calculation',
          'Equivalent weight concept',
        ],
      },
    ],
  },
  {
    id: 'atomic-structure',
    unit: 2,
    title: 'Structure of Atom',
    description: 'Bohr model, quantum numbers, orbitals, and electronic configuration.',
    category: 'physical',
    icon: '⚛️',
    color: '#06b6d4',
    hasVisualization: true,
    topics: [
      {
        title: 'Atomic Models',
        subtopics: [
          "Dalton's atomic theory",
          "Thomson's plum pudding model",
          "Rutherford's nuclear model and gold foil experiment",
          "Bohr's model: postulates and hydrogen spectrum",
          'Limitations of Bohr model',
        ],
      },
      {
        title: 'Quantum Mechanical Model',
        subtopics: [
          'de Broglie hypothesis: λ = h/mv',
          "Heisenberg's uncertainty principle",
          "Schrödinger's wave equation (conceptual)",
          'Concept of orbital vs orbit',
          'Probability density and radial distribution',
        ],
      },
      {
        title: 'Quantum Numbers',
        subtopics: [
          'Principal quantum number (n)',
          'Azimuthal (angular momentum) quantum number (l)',
          'Magnetic quantum number (m)',
          'Spin quantum number (ms)',
          'Allowed values and their physical significance',
        ],
      },
      {
        title: 'Electronic Configuration',
        subtopics: [
          'Shape of s, p, d, f orbitals',
          'Aufbau principle and energy ordering',
          "Pauli's exclusion principle",
          "Hund's rule of maximum multiplicity",
          'Writing electronic configurations for elements up to Z=30',
          'Exceptional configurations: Cr and Cu',
        ],
      },
    ],
  },
  {
    id: 'periodic-table',
    unit: 9,
    title: 'Periodic Classification of Elements',
    description: 'Periodic trends: atomic radius, IE, EA, electronegativity and their variation.',
    category: 'physical',
    icon: '📊',
    color: '#f59e0b',
    hasVisualization: true,
    topics: [
      {
        title: 'Modern Periodic Law',
        subtopics: [
          "Mendeleev's periodic law and its limitations",
          'Modern periodic law based on atomic number',
          'Periods and groups in the long form periodic table',
          's, p, d, f block elements',
        ],
      },
      {
        title: 'Periodic Trends',
        subtopics: [
          'Atomic and ionic radius (across period and down group)',
          'Ionization energy (IE₁, IE₂) trends and anomalies',
          'Electron affinity and electronegativity trends',
          'Metallic/non-metallic character',
        ],
      },
      {
        title: 'Valency and Oxidation State',
        subtopics: [
          'Valency from electronic configuration',
          'Oxidation state rules and assignment',
          'Variation of oxidation state in transition metals',
        ],
      },
    ],
  },
  {
    id: 'chemical-bonding',
    unit: 3,
    title: 'Chemical Bonding and Molecular Structure',
    description: 'Ionic & covalent bonds, VSEPR theory, hybridization, and MO theory.',
    category: 'physical',
    icon: '🔗',
    color: '#8b5cf6',
    hasVisualization: true,
    topics: [
      {
        title: 'Ionic and Covalent Bonding',
        subtopics: [
          'Conditions for ionic bond formation',
          'Lattice energy and Born-Haber cycle (conceptual)',
          'Covalent bond: sharing of electron pairs',
          'Lewis dot structures and octet rule',
          'Formal charge calculation',
        ],
      },
      {
        title: 'VSEPR Theory',
        subtopics: [
          'VSEPR rules and molecular geometry prediction',
          'Linear, trigonal planar, tetrahedral shapes',
          'Trigonal pyramidal, bent, and octahedral',
          'Effect of lone pairs on bond angle',
        ],
      },
      {
        title: 'Hybridization',
        subtopics: [
          'sp hybridization (linear, 180°)',
          'sp² hybridization (trigonal planar, 120°)',
          'sp³ hybridization (tetrahedral, 109.5°)',
          'sp³d and sp³d² for expanded octet molecules',
          'Determination of hybridization from structure',
        ],
      },
      {
        title: 'Molecular Orbital Theory',
        subtopics: [
          'LCAO principle: bonding and antibonding MOs',
          'MO diagrams for H₂, N₂, O₂, F₂',
          'Bond order = (bonding e⁻ − antibonding e⁻) / 2',
          'Magnetic behaviour: para vs diamagnetic',
        ],
      },
      {
        title: 'Intermolecular Forces',
        subtopics: [
          'Van der Waals forces: London dispersion, dipole–dipole',
          'Hydrogen bonding: conditions, examples (HF, H₂O, NH₃)',
          'Effect on boiling point and solubility',
        ],
      },
    ],
  },
  {
    id: 'chemical-thermodynamics',
    unit: 4,
    title: 'Thermodynamics',
    description: 'Enthalpy, entropy, Gibbs energy, and spontaneity of reactions.',
    category: 'physical',
    icon: '🔥',
    color: '#ef4444',
    hasVisualization: true,
    topics: [
      {
        title: 'Basic Concepts',
        subtopics: [
          'System, surroundings, boundary types',
          'State functions vs path functions',
          'Internal energy (U) and enthalpy (H)',
          'Heat (q) and work (w): q = ΔH at constant P',
        ],
      },
      {
        title: 'First Law of Thermodynamics',
        subtopics: [
          'ΔU = q + w',
          'Isothermal and adiabatic processes',
          "Hess's law of constant heat summation",
          'Standard enthalpy of formation, combustion, neutralisation',
          'Bond enthalpy calculations',
        ],
      },
      {
        title: 'Second and Third Laws',
        subtopics: [
          'Entropy (S): disorder and spontaneity',
          'ΔS for phase changes and mixing',
          'Clausius inequality: ΔS ≥ q/T',
          'Third law: absolute zero entropy',
        ],
      },
      {
        title: 'Gibbs Energy and Spontaneity',
        subtopics: [
          'ΔG = ΔH − TΔS',
          'Criteria for spontaneity using ΔG',
          'Standard Gibbs energy and equilibrium constant: ΔG° = −RT ln K',
          'Temperature dependence of spontaneity',
        ],
      },
    ],
  },
  {
    id: 'solutions',
    unit: 5,
    title: 'Solutions',
    description: 'Colligative properties, Raoult\'s law, and concentration terms.',
    category: 'physical',
    icon: '🧪',
    color: '#06b6d4',
    hasVisualization: true,
    topics: [
      {
        title: 'Concentration Terms',
        subtopics: [
          'Molarity (M), Molality (m), Normality (N)',
          'Mole fraction and mass percentage',
          'Parts per million (ppm)',
          'Interconversions between concentration units',
        ],
      },
      {
        title: "Raoult's Law",
        subtopics: [
          "Raoult's law for ideal solutions",
          'Vapour pressure of solutions (PA = xA·PA°)',
          'Total vapour pressure of a binary mixture',
          'Ideal vs non-ideal solutions (positive/negative deviations)',
        ],
      },
      {
        title: 'Colligative Properties',
        subtopics: [
          'Relative lowering of vapour pressure',
          'Elevation of boiling point: ΔTb = Kb·m',
          'Depression of freezing point: ΔTf = Kf·m',
          'Osmotic pressure: π = iCRT',
          "van 't Hoff factor (i) for electrolytes",
        ],
      },
    ],
  },
  {
    id: 'equilibrium',
    unit: 6,
    title: 'Chemical Equilibrium',
    description: 'Le Chatelier\'s principle, equilibrium constants, and ionic equilibria.',
    category: 'physical',
    icon: '⚖️',
    color: '#10b981',
    hasVisualization: true,
    topics: [
      {
        title: 'Equilibrium Constant',
        subtopics: [
          'Dynamic chemical equilibrium',
          'Kc and Kp expressions',
          'Relation between Kp and Kc: Kp = Kc(RT)^Δn',
          'Homogeneous and heterogeneous equilibria',
          'Reaction quotient (Q) and direction of shift',
        ],
      },
      {
        title: "Le Chatelier's Principle",
        subtopics: [
          'Effect of concentration change',
          'Effect of pressure and volume change',
          'Effect of temperature on equilibrium',
          "Applications: Haber's process, Contact process",
        ],
      },
      {
        title: 'Ionic Equilibria',
        subtopics: [
          'Arrhenius, Brønsted–Lowry, and Lewis acid–base theories',
          'Ka, Kb: weak acid/base ionization',
          'Relation: Kw = Ka × Kb',
          'pH calculations: strong and weak acids/bases',
          'Buffer solutions and Henderson–Hasselbalch equation',
          'Ksp and solubility product, common ion effect',
        ],
      },
    ],
  },
  {
    id: 'redox-electrochemistry',
    unit: 7,
    title: 'Redox Reactions & Electrochemistry',
    description: 'Galvanic cells, electrode potentials, electrolysis, and Faraday\'s laws.',
    category: 'physical',
    icon: '⚡',
    color: '#f59e0b',
    hasVisualization: true,
    topics: [
      {
        title: 'Redox Reactions',
        subtopics: [
          'Oxidation number rules and assignment',
          'Identifying oxidising and reducing agents',
          'Balancing redox equations: ion-electron method',
          'Half-reactions in acidic and basic media',
        ],
      },
      {
        title: 'Electrochemical Cells',
        subtopics: [
          'Galvanic (voltaic) cell: Zn-Cu Daniel cell',
          'EMF of a cell: Ecell = Ecathode − Eanode',
          'Standard electrode potential (SRP table)',
          'Nernst equation: E = E° − (RT/nF)lnQ',
          'Relation: ΔG° = −nFE°',
        ],
      },
      {
        title: 'Electrolysis',
        subtopics: [
          "Faraday's first and second laws",
          'Electrolytic cells vs galvanic cells',
          'Electrolysis of molten NaCl and aqueous NaCl',
          'Industrial applications: electroplating, refining',
        ],
      },
      {
        title: 'Conductance',
        subtopics: [
          'Specific conductance, molar conductance',
          'Kohlrausch law for strong electrolytes',
          'Conductance of weak electrolytes — degree of dissociation',
        ],
      },
    ],
  },
  {
    id: 'chemical-kinetics',
    unit: 8,
    title: 'Chemical Kinetics',
    description: 'Rate laws, Arrhenius equation, reaction mechanisms, and energy diagrams.',
    category: 'physical',
    icon: '📈',
    color: '#ec4899',
    hasVisualization: true,
    topics: [
      {
        title: 'Rate of Reaction',
        subtopics: [
          'Average rate and instantaneous rate',
          'Rate law expression: r = k[A]^m[B]^n',
          'Order of reaction and molecularity',
          'Units of rate constant k for different orders',
        ],
      },
      {
        title: 'Integrated Rate Laws',
        subtopics: [
          'Zero-order: [A] = [A]₀ − kt',
          'First-order: ln[A] = ln[A]₀ − kt; t½ = 0.693/k',
          'Second-order rate expression and half-life',
          'Pseudo first-order reactions (e.g., acid hydrolysis)',
        ],
      },
      {
        title: 'Arrhenius Equation and Activation Energy',
        subtopics: [
          'k = A·e^(−Ea/RT)',
          'Effect of temperature on rate (10°C rule)',
          'Activation energy from ln k vs 1/T graph',
          'Role of catalyst: lowers Ea, increases rate',
        ],
      },
      {
        title: 'Reaction Mechanisms',
        subtopics: [
          'Elementary reactions and rate-determining step',
          'Collision theory of chemical reactions',
          'Transition state theory (conceptual)',
          'Chain reactions: initiation, propagation, termination',
        ],
      },
    ],
  },

  // ─── INORGANIC CHEMISTRY ──────────────────────────────────────────
  {
    id: 'block-elements-s',
    unit: 10,
    title: 's-Block Elements',
    description: 'Alkali and alkaline earth metals: properties, reactions, and compounds.',
    category: 'inorganic',
    icon: '🔩',
    color: '#a78bfa',
    hasVisualization: false,
    topics: [
      {
        title: 'Group 1 — Alkali Metals (Li, Na, K, Rb, Cs)',
        subtopics: [
          'Electronic configuration: ns¹',
          'Physical properties: softness, low density, low melting point',
          'Reactivity with water, oxygen, and halogens',
          'Flame colours: Li–red, Na–yellow, K–violet, Rb–red-violet',
          'Compounds: NaOH, Na₂CO₃, NaHCO₃, NaCl (uses and preparation)',
          "Anomalous behaviour of Li (diagonal relationship to Mg)",
        ],
      },
      {
        title: 'Group 2 — Alkaline Earth Metals (Be, Mg, Ca)',
        subtopics: [
          'Electronic configuration: ns²',
          'Comparison with Group 1: higher melting point, harder',
          'Reactivity with water: Be < Mg < Ca',
          'Compounds: CaO (quicklime), Ca(OH)₂ (slaked lime), CaCO₃, CaSO₄',
          'Plaster of Paris: (CaSO₄)₂·H₂O',
          "Anomalous behaviour of Be (diagonal relationship to Al)",
        ],
      },
    ],
  },
  {
    id: 'block-elements-p',
    unit: 11,
    title: 'p-Block Elements (Groups 13–18)',
    description: 'Boron, carbon, nitrogen, oxygen, halogen, and noble gas groups.',
    category: 'inorganic',
    icon: '🔬',
    color: '#34d399',
    hasVisualization: false,
    topics: [
      {
        title: 'Group 13 — Boron Family',
        subtopics: [
          'General electronic config: ns² np¹',
          'Trend in metallic character: B (non-metal) → Tl (metal)',
          'Boron: covalent nature, borax (Na₂B₄O₇·10H₂O)',
          'Aluminium: amphoteric nature, reaction with acid and base',
        ],
      },
      {
        title: 'Group 14 — Carbon Family',
        subtopics: [
          'Carbon allotropes: diamond, graphite, fullerene (C₆₀)',
          'Oxides of carbon: CO, CO₂',
          'Silicates: types and structure (SiO₄⁴⁻ tetrahedra)',
          'Germanium, tin, lead: trends in stability of +2 and +4 states',
        ],
      },
      {
        title: 'Group 15 — Nitrogen Family',
        subtopics: [
          'N₂: triple bond, inertness; oxidation states',
          'Hydrides: NH₃, PH₃; oxides of nitrogen (NO, NO₂, N₂O₅)',
          'Oxy-acids of nitrogen and phosphorus',
          'Phosphorus allotropes: white, red, black',
        ],
      },
      {
        title: 'Group 16, 17, 18',
        subtopics: [
          'Oxygen family: ozone (O₃), sulphur allotropes, H₂SO₄ (contact process)',
          'Halogen family: reactivity order F > Cl > Br > I',
          'Interhalogen compounds (ClF₃, IF₅)',
          'Noble gases: discovery, uses, XeF₂, XeF₄',
        ],
      },
    ],
  },
  {
    id: 'block-elements-d',
    unit: 12,
    title: 'd and f-Block Elements',
    description: 'Transition metals, inner transition elements, and coordination compounds.',
    category: 'inorganic',
    icon: '⚙️',
    color: '#60a5fa',
    hasVisualization: false,
    topics: [
      {
        title: 'Transition Metals (3d series)',
        subtopics: [
          'Electronic configurations from Sc (Z=21) to Zn (Z=30)',
          'Variable oxidation states and stability',
          'Colour of transition metal ions (d–d transitions)',
          'Paramagnetism and unpaired electrons',
          'Catalytic properties and complex formation',
        ],
      },
      {
        title: 'Coordination Compounds',
        subtopics: [
          'Ligands: types (mono, bi, polydentate), charge',
          'IUPAC nomenclature of coordination compounds',
          "Werner's theory of coordination compounds",
          'Geometrical isomerism: cis–trans in square planar/octahedral',
          'Optical isomerism in octahedral complexes',
          "Crystal field theory: splitting of d-orbitals (Δo, Δt), CFSE",
        ],
      },
      {
        title: 'f-Block Elements',
        subtopics: [
          'Lanthanides: 4f filling, lanthanide contraction',
          'Actinides: 5f filling, radioactive nature',
          'Uses: nuclear fuels, catalysts',
        ],
      },
    ],
  },
  {
    id: 'metallurgy',
    unit: 13,
    title: 'Metallurgy',
    description: 'Principles of metal extraction, refining, and relevant chemistry.',
    category: 'inorganic',
    icon: '🏭',
    color: '#94a3b8',
    hasVisualization: false,
    topics: [
      {
        title: 'Occurrence of Metals',
        subtopics: [
          'Minerals vs ores',
          'Common ores: haematite (Fe₂O₃), bauxite (Al₂O₃·2H₂O), galena (PbS)',
          'Concentration methods: magnetic separation, froth flotation, leaching',
        ],
      },
      {
        title: 'Extraction Processes',
        subtopics: [
          'Calcination and roasting',
          'Smelting and reduction (reduction by C, CO, Al)',
          'Electrolytic reduction: Al from Hall–Héroult process',
          'Thermite reaction',
        ],
      },
      {
        title: 'Refining of Metals',
        subtopics: [
          'Electrolytic refining (Cu, Ag, Au)',
          'Zone refining for semiconductors',
          'Vapour phase refining (Mond process for Ni)',
          'Chromatographic methods',
        ],
      },
      {
        title: "Ellingham Diagram",
        subtopics: [
          'Variation of ΔG° with temperature for metal oxides',
          'Conditions when C can reduce an ore',
          'Reduction of ZnO, Fe₂O₃ using Ellingham diagram',
        ],
      },
    ],
  },

  // ─── ORGANIC CHEMISTRY ────────────────────────────────────────────
  {
    id: 'basic-organic-chemistry',
    unit: 14,
    title: 'Basic Principles of Organic Chemistry',
    description: 'Electronic effects, reaction intermediates, and reaction mechanisms.',
    category: 'organic',
    icon: '🌿',
    color: '#84cc16',
    hasVisualization: true,
    topics: [
      {
        title: 'Electronic Effects',
        subtopics: [
          'Inductive effect: +I and −I groups',
          'Electromeric effect: +E and −E',
          'Resonance and mesomeric effect (+M and −M)',
          'Hyperconjugation: Baker–Nathan effect',
        ],
      },
      {
        title: 'Reaction Intermediates',
        subtopics: [
          'Carbocation: stability order, hybridization',
          'Carbanion: stability order',
          'Free radicals: stability, reactions',
          'Carbene and nitrene (brief)',
        ],
      },
      {
        title: 'Fission of Bonds',
        subtopics: [
          'Homolytic fission → free radicals',
          'Heterolytic fission → ions (electrophiles and nucleophiles)',
        ],
      },
      {
        title: 'Types of Reactions',
        subtopics: [
          'Electrophilic addition (EA)',
          'Nucleophilic substitution (SN1, SN2)',
          'Electrophilic aromatic substitution (EAS)',
          'Elimination (E1, E2)',
          'Free radical reactions (halogenation of alkanes)',
        ],
      },
    ],
  },
  {
    id: 'hydrocarbons',
    unit: 15,
    title: 'Hydrocarbons',
    description: 'Alkanes, alkenes, alkynes, and aromatic hydrocarbons — reactions and mechanisms.',
    category: 'organic',
    icon: '⛽',
    color: '#fb923c',
    hasVisualization: true,
    topics: [
      {
        title: 'Alkanes',
        subtopics: [
          'IUPAC nomenclature of branched alkanes',
          'Conformations: staggered and eclipsed (ethane)',
          'Halogenation: free radical mechanism',
          'Combustion and pyrolysis',
        ],
      },
      {
        title: 'Alkenes',
        subtopics: [
          'sp² hybridization and π bond',
          'Geometrical isomerism (cis–trans)',
          "Markovnikov's rule of addition",
          'Electrophilic addition of HX, H₂O, Br₂',
          'Ozonolysis, hydrogenation, oxidation (KMnO₄)',
        ],
      },
      {
        title: 'Alkynes',
        subtopics: [
          'sp hybridization and triple bond',
          'Acidic nature of terminal alkynes',
          'Addition of H₂, HX (Markovnikov), H₂O (Wacker process)',
          'Reduction to alkene (Lindlar catalyst) or alkane',
        ],
      },
      {
        title: 'Aromatic Hydrocarbons',
        subtopics: [
          "Hückel's rule of aromaticity (4n+2 π electrons)",
          'Benzene: Kekulé structure, resonance',
          'Electrophilic aromatic substitution (EAS): mechanism',
          'Halogenation, nitration, sulfonation, Friedel–Crafts',
          'Directing effects: ortho/para vs meta directors',
        ],
      },
    ],
  },
  {
    id: 'haloalkanes-haloarenes',
    unit: 16,
    title: 'Haloalkanes and Haloarenes',
    description: 'Nucleophilic substitution, elimination, and properties of halogenated compounds.',
    category: 'organic',
    icon: '🔀',
    color: '#818cf8',
    hasVisualization: false,
    topics: [
      {
        title: 'Classification and Preparation',
        subtopics: [
          'Primary, secondary, tertiary haloalkanes',
          'Preparation from alcohols, alkenes (HX, X₂), and alkanes',
          'Haloarene preparation: direct halogenation (EAS)',
        ],
      },
      {
        title: 'Nucleophilic Substitution',
        subtopics: [
          'SN1: mechanism, rate, stereochemistry (racemisation)',
          'SN2: mechanism, rate, backside attack, inversion (Walden)',
          'Factors affecting SN1 vs SN2',
        ],
      },
      {
        title: 'Elimination Reactions',
        subtopics: [
          'E1 and E2 mechanisms',
          "Zaitsev's rule",
          'Competition between substitution and elimination',
        ],
      },
      {
        title: 'Polyhalogen Compounds',
        subtopics: [
          'CHCl₃ (chloroform), CCl₄, freons, DDT — uses and hazards',
          'Environmental impact of halogen compounds',
        ],
      },
    ],
  },
  {
    id: 'alcohols-phenols-ethers',
    unit: 17,
    title: 'Alcohols, Phenols, and Ethers',
    description: 'Structure, acidity, reactions and preparation of alcohols, phenols, and ethers.',
    category: 'organic',
    icon: '🍷',
    color: '#c084fc',
    hasVisualization: false,
    topics: [
      {
        title: 'Alcohols',
        subtopics: [
          'Classification: 1°, 2°, 3° alcohols',
          'Preparation: hydration of alkenes, reduction of carbonyl compounds',
          'Physical properties: H-bonding, boiling points',
          'Reactions: with Na, Lucas test, oxidation, dehydration, esterification',
          'Distinction between 1°, 2°, 3° alcohol (Lucas test)',
        ],
      },
      {
        title: 'Phenols',
        subtopics: [
          'Acidic nature: phenol > H₂O (resonance stabilisation of phenoxide)',
          'Preparation from cumene and from haloarenes',
          'Reactions: electrophilic substitution (ring activated), Reimer–Tiemann, Kolbe\'s reaction',
          'Liebermann reaction for phenol confirmation',
        ],
      },
      {
        title: 'Ethers',
        subtopics: [
          'Preparation by dehydration and Williamson synthesis',
          'Chemical properties: cleavage by HI/HBr',
          'Crown ethers and their uses',
        ],
      },
    ],
  },
  {
    id: 'aldehydes-ketones',
    unit: 18,
    title: 'Aldehydes, Ketones, and Carboxylic Acids',
    description: 'Nucleophilic addition, oxidation/reduction, and carboxylic acid reactions.',
    category: 'organic',
    icon: '🧬',
    color: '#f87171',
    hasVisualization: false,
    topics: [
      {
        title: 'Aldehydes and Ketones',
        subtopics: [
          'Preparation: oxidation of alcohols, ozonolysis, Rosenmund reduction, Gattermann-Koch',
          'Nucleophilic addition: HCN, RMgX, NaHSO₃',
          'Aldol condensation and crossed aldol',
          'Cannizzaro reaction (no α-H aldehydes)',
          'Clemmensen and Wolff–Kishner reduction',
          'Tollens, Fehling, and Benedict tests for aldehydes',
          'Iodoform test for methyl ketones/acetaldehyde',
        ],
      },
      {
        title: 'Carboxylic Acids',
        subtopics: [
          'Preparation: oxidation, carbonation of Grignard, hydrolysis of nitriles',
          'Acidic strength factors: −I effect, resonance',
          'Reactions: esterification (Fischer), acyl chloride, anhydride formation',
          'Decarboxylation: dry distillation of Ca salts',
          'Hell–Volhard–Zelinsky (HVZ) reaction',
        ],
      },
    ],
  },
  {
    id: 'amines',
    unit: 19,
    title: 'Amines and Diazonium Salts',
    description: 'Classification, basicity, preparation, and reactions of amines; azo coupling.',
    category: 'organic',
    icon: '🔵',
    color: '#38bdf8',
    hasVisualization: false,
    topics: [
      {
        title: 'Classification and Basicity',
        subtopics: [
          'Primary, secondary, tertiary amines; quaternary ammonium salt',
          'Basicity: aliphatic > ammonia > aromatic amines',
          'Effect of substituents on basicity of aniline',
          'Kb and pKb comparisons',
        ],
      },
      {
        title: 'Preparation',
        subtopics: [
          'Reduction of nitro compounds (Fe/HCl, LiAlH₄)',
          'Gabriel phthalimide synthesis (1° amine)',
          'Hofmann bromamide degradation',
          'Reduction of nitriles, amides, and oximes',
        ],
      },
      {
        title: 'Chemical Reactions',
        subtopics: [
          'Acylation and benzoylation (Schotten–Baumann)',
          'Carbylamine reaction (isocyanide test) for 1° amine',
          'Hinsberg test to distinguish 1°, 2°, 3° amines',
          'Reaction with HNO₂: diazotisation of 1° aromatic amine',
        ],
      },
      {
        title: 'Diazonium Salts',
        subtopics: [
          'Preparation of ArN₂⁺X⁻',
          'Sandmeyer reaction: replacement by Cl, Br, CN, OH',
          'Gattermann reaction: replacement by F',
          'Azo coupling: formation of azo dyes (coupling with phenol/amine)',
        ],
      },
    ],
  },
  {
    id: 'biomolecules-polymers',
    unit: 20,
    title: 'Biomolecules and Polymers',
    description: 'Carbohydrates, amino acids, nucleic acids, and polymer chemistry.',
    category: 'organic',
    icon: '🧫',
    color: '#4ade80',
    hasVisualization: false,
    topics: [
      {
        title: 'Carbohydrates',
        subtopics: [
          'Classification: monosaccharides, disaccharides, polysaccharides',
          'D-glucose: open chain and cyclic (Haworth) structure',
          'Reducing and non-reducing sugars (Tollens, Benedict test)',
          'Sucrose (non-reducing), maltose, lactose (reducing)',
          'Starch and cellulose: structure and function',
        ],
      },
      {
        title: 'Amino Acids and Proteins',
        subtopics: [
          'General structure: H₂N–CHR–COOH',
          'Classification: acidic, basic, neutral amino acids',
          'Zwitterion, isoelectric point',
          'Peptide bond formation',
          '1°, 2°, 3°, 4° structure of proteins',
          'Denaturation of proteins',
        ],
      },
      {
        title: 'Nucleic Acids',
        subtopics: [
          'DNA and RNA: components (base, sugar, phosphate)',
          'Purines (A, G) and pyrimidines (C, T, U)',
          "Watson–Crick double helix model",
          'Base pairing: A–T, G–C in DNA',
        ],
      },
      {
        title: 'Polymers',
        subtopics: [
          'Classification: addition and condensation polymers',
          'Natural rubber and vulcanisation',
          'Polyethylene, PVC, Teflon, Nylon-6,6, Dacron/Terylene',
          'Bakelite and Melamine (thermosetting polymers)',
          'Biodegradable polymers: PHBV',
        ],
      },
    ],
  },
];

export const getChapterById = (id: string): ChemistryChapter | undefined =>
  chemistryChapters.find((c) => c.id === id);

export type { ChemistryChapter };
