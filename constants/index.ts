
export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription,

                                    }: {
    jobTitle: string;
    jobDescription?: string;

}) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
  Please analyze and rate this resume and suggest how to improve it.
  The rating can be low if the resume is bad.
  Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
  If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
  If available, use the job description for the job user is applying to to give more detailed feedback.
  If provided, take the job description into consideration.
  The job title is: ${jobTitle}
  The job description is: ${jobDescription || "Not provided"}
  Provide the feedback using the following format: ${AIResponseFormat}
  Return the analysis as a JSON object, without any other text and without the backticks.
  Do not include any other text or comments.`;

export const jobRecommendationResponseFormat = `
interface JobRecommendationResult {
  generatedAt: string;
  resumeSummary: string;
  targetRoles: {
    title: string;
    matchScore: number;
    seniority: string;
    locationType: "Remote" | "Hybrid" | "On-site" | "Any";
    whyGoodFit: string;
    skillsToHighlight: string[];
    skillsToImprove: string[];
    searchKeywords: string[];
    searchUrl: string;
  }[];
  nextSteps: string[];
}`;

export const prepareJobRecommendationInstructions = ({
                                                       jobTitle,
                                                       jobDescription,
                                                       feedback,
                                                   }: {
    jobTitle?: string;
    jobDescription?: string;
    feedback: Feedback;
}) =>
    `You are an expert career advisor and technical recruiter.
Recommend current, realistic job roles for this candidate based on the attached resume and resume analysis.
Use today's job-market context, but do not invent specific job postings, employers, salaries, or application deadlines.
Return 5 role recommendations that the candidate can search for now.

Original target job title: ${jobTitle || "Not provided"}
Original job description: ${jobDescription || "Not provided"}
Resume analysis JSON: ${JSON.stringify(feedback)}

For each recommendation:
- Choose a practical role title.
- Estimate a match score from 0 to 100.
- Include seniority, preferred location type, why it fits, skills to highlight, skills to improve, search keywords, and a searchUrl.
- searchUrl must be a real LinkedIn Jobs search URL using the role keywords.

Provide the response using this format: ${jobRecommendationResponseFormat}
Return only valid JSON. Do not include markdown, backticks, comments, or any extra text.`;

export const optimizedResumeResponseFormat = `
interface OptimizedResume {
  generatedAt: string;
  targetRole: string;
  candidateName: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
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
}`;

export const prepareOptimizedResumeInstructions = ({
                                                       jobTitle,
                                                       jobDescription,
                                                       feedback,
                                                   }: {
    jobTitle?: string;
    jobDescription?: string;
    feedback: Feedback;
}) =>
    `You are an expert resume writer and ATS optimization specialist.
Use the attached uploaded resume as the source of truth and create a new updated resume that is fully aligned to the target job role and job description.

Important rules:
- Preserve the candidate's real existing information from the uploaded resume, including name, contact details, education, employers, projects, certifications, dates, and tools when present.
- Rewrite and reorganize the existing resume content so it fits the target job description better.
- Do not invent employers, degrees, certifications, job dates, metrics, or tools that are not supported by the original resume.
- You may improve wording, structure, ordering, clarity, and ATS keyword coverage.
- If a metric is missing, do not fabricate a number. Write impact-focused bullets without fake numbers.
- Make the resume concise, professional, and tailored to the target role.
- Prioritize fixing weaknesses from the resume analysis.
- If the current resume is weak, make the new draft substantially stronger and more targeted while still using only the candidate's existing resume facts.
- The final output should read like a complete new resume generated from the candidate's originally uploaded resume and suitable to download as a PDF.

Target job title: ${jobTitle || "Not provided"}
Target job description: ${jobDescription || "Not provided"}
Resume analysis JSON: ${JSON.stringify(feedback)}

Provide the optimized resume using this format: ${optimizedResumeResponseFormat}
Return only valid JSON. Do not include markdown, backticks, comments, or any extra text.`;
