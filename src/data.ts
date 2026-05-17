/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LearningOutcome {
  id: string;
  code: string;
  title: string;
  domain: string;
  description: string;
  score: number; // 0-100 (IXL SmartScore style)
  status: 'mastered' | 'challenging' | 'covered' | 'not-started';
  commonlyMissed?: boolean;
}

export interface PracticedWorksheet {
  id: string;
  date: string;
  title: string;
  skills: string[];
  score: number;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  subject: string;
  avatar: string;
  overallProgress: number;
  domainProgress: { [key: string]: number };
  outcomes: LearningOutcome[];
  practicedWorksheets: PracticedWorksheet[];
  teacherRemarks?: {
    confidence: 'low' | 'medium' | 'high';
    emotionalRelationship: 'dislikes' | 'scared' | 'indifferent' | 'confused' | 'likes' | 'loves';
    purpose: 'cover-basics' | 'cover-current' | 'above-and-beyond';
    cognitiveDevelopment: {
      memory: number;
      organization: number;
      focus: number;
      selfServe: number;
      avoidingMistakes: number;
      grit: number;
    };
  };
}

export const DOMAINS_GRADES: { [key: string]: string[] } = {
  "Grade 5": [
    "Number Sense",
    "Addition & Subtraction",
    "Multiplication & Division",
    "Fractions",
    "Geometry",
    "Data & Probability"
  ],
  "Grade 7": [
    "Ratios and Proportional Relationships",
    "The Number System",
    "Expressions and Equations",
    "Geometry",
    "Statistics and Probability"
  ]
};

export const STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Nia Advani",
    grade: "Grade 7",
    subject: "Math",
    avatar: "👩‍🎓",
    overallProgress: 37,
    domainProgress: {
      "Ratios and Proportional Relationships": 45,
      "The Number System": 20,
      "Expressions and Equations": 35,
      "Geometry": 60,
      "Statistics and Probability": 15
    },
    outcomes: [
      {
        id: "r1",
        code: "R.1",
        title: "Unit rates",
        domain: "Ratios and Proportional Relationships",
        description: "Calculate unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities.",
        score: 45,
        status: "challenging",
        commonlyMissed: true
      },
      {
        id: "r2",
        code: "R.2",
        title: "Proportional relationships",
        domain: "Ratios and Proportional Relationships",
        description: "Recognize and represent proportional relationships between quantities.",
        score: 65,
        status: "covered"
      },
      {
        id: "r3",
        code: "R.3",
        title: "Constant of proportionality",
        domain: "Ratios and Proportional Relationships",
        description: "Identify the constant of proportionality (unit rate) in tables, graphs, equations, diagrams, and verbal descriptions.",
        score: 22,
        status: "not-started"
      },
      {
        id: "ns1",
        code: "NS.1",
        title: "Integer addition and subtraction",
        domain: "The Number System",
        description: "Add and subtract rational numbers; represent addition and subtraction on a horizontal or vertical number line diagram.",
        score: 88,
        status: "mastered"
      },
      {
        id: "ns2",
        code: "NS.2",
        title: "Integer multiplication",
        domain: "The Number System",
        description: "Apply and extend previous understandings of multiplication and division and of fractions to multiply and divide rational numbers.",
        score: 30,
        status: "challenging"
      },
      {
        id: "ns3",
        code: "NS.3",
        title: "Rational numbers as decimals",
        domain: "The Number System",
        description: "Convert a rational number to a decimal using long division; know that the decimal form of a rational number terminates.",
        score: 50,
        status: "covered"
      },
      {
        id: "ee1",
        code: "EE.4",
        title: "Solve multi-step equations",
        domain: "Expressions and Equations",
        description: "Solve word problems leading to equations of the form px + q = r and p(x + q) = r.",
        score: 12,
        status: "not-started"
      },
      {
        id: "ee2",
        code: "EE.1",
        title: "Linear expressions",
        domain: "Expressions and Equations",
        description: "Apply properties of operations as strategies to add, subtract, factor, and expand linear expressions with rational coefficients.",
        score: 72,
        status: "mastered"
      },
      {
        id: "ee3",
        code: "EE.2",
        title: "Rewriting expressions",
        domain: "Expressions and Equations",
        description: "Understand that rewriting an expression in different forms in a problem context can shed light on the problem.",
        score: 95,
        status: "mastered"
      },
      {
        id: "g1",
        code: "G.1",
        title: "Scale drawings",
        domain: "Geometry",
        description: "Solve problems involving scale drawings of geometric figures, including computing actual lengths and areas from a scale drawing.",
        score: 25,
        status: "not-started"
      },
      {
        id: "g2",
        code: "G.4",
        title: "Area and circumference",
        domain: "Geometry",
        description: "Know the formulas for the area and circumference of a circle and use them to solve problems.",
        score: 55,
        status: "covered"
      },
      {
        id: "g3",
        code: "G.5",
        title: "Angle relationships",
        domain: "Geometry",
        description: "Use facts about supplementary, complementary, vertical, and adjacent angles in a multi-step problem to write and solve equations.",
        score: 0,
        status: "not-started"
      },
      {
        id: "sp1",
        code: "SP.1",
        title: "Random sampling",
        domain: "Statistics and Probability",
        description: "Understand that statistics can be used to gain information about a population by examining a sample of the population.",
        score: 10,
        status: "not-started"
      },
      {
        id: "sp2",
        code: "SP.3",
        title: "Comparing distributions",
        domain: "Statistics and Probability",
        description: "Informally assess the degree of visual overlap of two numerical data distributions with similar variabilities.",
        score: 40,
        status: "challenging"
      },
      {
        id: "sp3",
        code: "SP.5",
        title: "Probability of events",
        domain: "Statistics and Probability",
        description: "Understand that the probability of a chance event is a number between 0 and 1 that expresses the likelihood of the event occurring.",
        score: 85,
        status: "mastered"
      },
      {
        id: "r4",
        code: "R.1",
        title: "Unit rates of fractions",
        domain: "Ratios and Proportional Relationships",
        description: "Compute unit rates associated with ratios of fractions, including ratios of lengths, areas and other quantities.",
        score: 15,
        status: "not-started"
      }
    ],
    practicedWorksheets: [
      {
        id: "w1",
        date: "Oct 12, 2023",
        title: "Ratio Mastery Quiz",
        skills: ["Unit rates", "Ratios"],
        score: 85
      },
      {
        id: "w2",
        date: "Oct 15, 2023",
        title: "Expressions Review",
        skills: ["Linear expressions"],
        score: 92
      }
    ],
    teacherRemarks: {
      confidence: 'high',
      emotionalRelationship: 'likes',
      purpose: 'cover-current',
      cognitiveDevelopment: {
        memory: 92,
        organization: 65,
        focus: 88,
        selfServe: 75,
        avoidingMistakes: 45,
        grit: 82
      }
    }
  },
  {
    id: "s2",
    name: "Leo Zhang",
    grade: "Grade 5",
    subject: "Math",
    avatar: "👦",
    overallProgress: 68,
    domainProgress: {
      "Number Sense": 90,
      "Addition & Subtraction": 95,
      "Multiplication & Division": 70,
      "Fractions": 40,
      "Geometry": 30,
      "Data & Probability": 20
    },
    outcomes: [
      {
        id: "ns1",
        code: "A.1",
        title: "Convert between standard and expanded form",
        domain: "Number Sense",
        description: "Write numbers up to 100,000 in expanded and standard notation.",
        score: 100,
        status: "mastered"
      },
      {
        id: "fr1",
        code: "F.1",
        title: "Equivalent fractions",
        domain: "Fractions",
        description: "Identify and generate equivalent fractions using models.",
        score: 42,
        status: "challenging",
        commonlyMissed: true
      },
      {
        id: "g1",
        code: "G.2",
        title: "Classifying shapes",
        domain: "Geometry",
        description: "Classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines.",
        score: 0,
        status: "not-started"
      }
    ],
    practicedWorksheets: []
  }
];
