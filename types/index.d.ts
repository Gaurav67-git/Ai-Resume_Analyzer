interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}

interface JobRecommendation {
    title: string;
    matchScore: number;
    seniority: string;
    locationType: "Remote" | "Hybrid" | "On-site" | "Any";
    whyGoodFit: string;
    skillsToHighlight: string[];
    skillsToImprove: string[];
    searchKeywords: string[];
    searchUrl: string;
}

interface JobRecommendationResult {
    generatedAt: string;
    targetRoles: JobRecommendation[];
    resumeSummary: string;
    nextSteps: string[];
}

interface OptimizedResume {
    generatedAt: string;
    targetRole: string;
    headline: string;
    summary: string;
    skills: string[];
    experience: {
        title: string;
        company: string;
        location?: string;
        dates?: string;
        bullets: string[];
    }[];
    projects: {
        name: string;
        bullets: string[];
    }[];
    education: string[];
    certifications: string[];
    keywordsAdded: string[];
    improvementNotes: string[];
}
