import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { prepareOptimizedResumeInstructions } from "../../constants";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: "Resumind | Optimized Resume" },
    { name: "description", content: "AI-generated resume draft aligned to your target role" },
]);

const parseOptimizedResume = (content: string | any[]) => {
    const text = typeof content === "string" ? content : content?.[0]?.text;
    if (!text) throw new Error("AI response was empty");

    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    return JSON.parse(cleaned) as OptimizedResume;
};

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="!text-2xl !text-black font-bold">{title}</h2>
        <div className="mt-4">{children}</div>
    </section>
);

const OptimizedResumePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, isLoading, ai, kv } = usePuterStore();
    const [optimizedResume, setOptimizedResume] = useState<OptimizedResume | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");
    const [score, setScore] = useState<number | null>(null);
    const [isEligible, setIsEligible] = useState(true);

    const handleDownloadPdf = () => {
        window.print();
    };

    const generateOptimizedResume = async (forceRefresh = false) => {
        if (!id) return;

        setError("");
        setIsGenerating(true);

        try {
            const resume = await kv.get(`resume:${id}`);
            if (!resume) {
                setError("Resume not found.");
                setIsGenerating(false);
                return;
            }

            const data = JSON.parse(resume) as Resume;
            setScore(data.feedback.overallScore);

            if (data.feedback.overallScore >= 70) {
                setIsEligible(false);
                setOptimizedResume(null);
                setIsGenerating(false);
                return;
            }

            setIsEligible(true);

            if (!forceRefresh) {
                const cached = await kv.get(`optimized-resume:${id}`);
                if (cached) {
                    setOptimizedResume(JSON.parse(cached));
                    setIsGenerating(false);
                    return;
                }
            }

            const response = await ai.chat(
                [
                    {
                        role: "user",
                        content: [
                            {
                                type: "file",
                                puter_path: data.resumePath,
                            },
                            {
                                type: "text",
                                text: prepareOptimizedResumeInstructions({
                                    jobTitle: data.jobTitle,
                                    jobDescription: data.jobDescription,
                                    feedback: data.feedback,
                                }),
                            },
                        ],
                    },
                ],
                { model: "gpt-4o-mini" }
            );

            if (!response) {
                setError("Could not generate the optimized resume.");
                setIsGenerating(false);
                return;
            }

            const parsed = parseOptimizedResume(response.message.content);
            await kv.set(`optimized-resume:${id}`, JSON.stringify(parsed));
            setOptimizedResume(parsed);
        } catch (err) {
            console.error(err);
            setError("Something went wrong while generating the optimized resume.");
        }

        setIsGenerating(false);
    };

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/optimized-resume/${id}`);
        }
    }, [auth.isAuthenticated, id, isLoading, navigate]);

    useEffect(() => {
        if (!isLoading && auth.isAuthenticated) {
            generateOptimizedResume();
        }
    }, [auth.isAuthenticated, id, isLoading]);

    return (
        <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover px-6 py-8">
            <section className="max-w-5xl mx-auto flex flex-col gap-8">
                <nav className="no-print flex items-center justify-between gap-4">
                    <Link to={`/resume/${id}`} className="back-button bg-white">
                        <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                        <span className="text-gray-800 text-sm font-semibold">Back to Review</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {optimizedResume && !isGenerating && (
                            <button
                                type="button"
                                className="primary-button w-fit"
                                onClick={handleDownloadPdf}
                            >
                                Download PDF
                            </button>
                        )}
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => generateOptimizedResume(true)}
                            disabled={isGenerating}
                        >
                            Regenerate Draft
                        </button>
                    </div>
                </nav>

                <div className="no-print page-heading !items-start !text-left">
                    <h1 className="text-4xl sm:text-5xl">AI Optimized Resume</h1>
                    <h2 className="text-xl">
                        A new resume draft fully aligned with the target job role and ATS feedback.
                    </h2>
                    {score !== null && score < 70 && (
                        <p className="rounded-full bg-badge-yellow px-4 py-2 text-badge-yellow-text font-semibold">
                            Resume score is weak, so this draft focuses on role alignment and missing ATS keywords.
                        </p>
                    )}
                </div>

                {!isEligible && !isGenerating && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="!text-2xl !text-black font-bold">New resume not needed</h2>
                        <p className="text-gray-600 mt-2">
                            This option is available only when the resume score is less than 70.
                        </p>
                    </div>
                )}

                {isGenerating && (
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-8">
                        <img src="/images/resume-scan-2.gif" className="w-[220px]" alt="Generating" />
                        <p className="text-gray-600 font-semibold">Building a stronger resume draft...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-white rounded-2xl p-6 text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                {optimizedResume && !isGenerating && (
                    <div className="flex flex-col gap-6">
                        <div className="printable-resume flex flex-col gap-6">
                        <Section title="Header">
                            <div className="flex flex-col gap-2">
                                <p className="text-2xl font-bold text-gray-900">{optimizedResume.headline}</p>
                                <p className="text-gray-600">Target role: {optimizedResume.targetRole}</p>
                            </div>
                        </Section>

                        <Section title="Professional Summary">
                            <p className="text-gray-700 leading-7">{optimizedResume.summary}</p>
                        </Section>

                        <Section title="Skills">
                            <div className="flex flex-wrap gap-2">
                                {optimizedResume.skills.map((skill) => (
                                    <span key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Section>

                        <Section title="Experience">
                            <div className="flex flex-col gap-6">
                                {optimizedResume.experience.map((role) => (
                                    <article key={`${role.title}-${role.company}`} className="flex flex-col gap-2">
                                        <div>
                                            <p className="font-bold text-gray-900">{role.title}</p>
                                            <p className="text-gray-600">
                                                {role.company}
                                                {role.location ? ` • ${role.location}` : ""}
                                                {role.dates ? ` • ${role.dates}` : ""}
                                            </p>
                                        </div>
                                        <ul className="list-disc pl-5 text-gray-700 flex flex-col gap-1">
                                            {role.bullets.map((bullet) => (
                                                <li key={bullet}>{bullet}</li>
                                            ))}
                                        </ul>
                                    </article>
                                ))}
                            </div>
                        </Section>

                        {optimizedResume.projects.length > 0 && (
                            <Section title="Projects">
                                <div className="flex flex-col gap-5">
                                    {optimizedResume.projects.map((project) => (
                                        <article key={project.name}>
                                            <p className="font-bold text-gray-900">{project.name}</p>
                                            <ul className="list-disc pl-5 text-gray-700 flex flex-col gap-1 mt-2">
                                                {project.bullets.map((bullet) => (
                                                    <li key={bullet}>{bullet}</li>
                                                ))}
                                            </ul>
                                        </article>
                                    ))}
                                </div>
                            </Section>
                        )}

                        <Section title="Education & Certifications">
                            <div className="flex flex-col gap-4 text-gray-700">
                                {optimizedResume.education.length > 0 && (
                                    <ul className="list-disc pl-5">
                                        {optimizedResume.education.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                                {optimizedResume.certifications.length > 0 && (
                                    <ul className="list-disc pl-5">
                                        {optimizedResume.certifications.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </Section>

                        </div>

                        <div className="no-print">
                        <Section title="What AI Improved">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="font-semibold text-gray-900">Keywords added</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {optimizedResume.keywordsAdded.map((keyword) => (
                                            <span key={keyword} className="rounded-full bg-badge-green px-3 py-1 text-sm text-badge-green-text">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Improvement notes</p>
                                    <ul className="list-disc pl-5 text-gray-700 mt-3 flex flex-col gap-1">
                                        {optimizedResume.improvementNotes.map((note) => (
                                            <li key={note}>{note}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Section>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
};

export default OptimizedResumePage;
