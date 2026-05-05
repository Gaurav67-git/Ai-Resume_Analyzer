import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { prepareJobRecommendationInstructions } from "../../constants";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: "Resumind | Job Recommendations" },
    { name: "description", content: "AI job recommendations based on your resume" },
]);

const parseRecommendationResponse = (content: string | any[]) => {
    const text = typeof content === "string" ? content : content?.[0]?.text;
    if (!text) throw new Error("AI response was empty");

    const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    return JSON.parse(cleaned) as JobRecommendationResult;
};

const Jobs = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const [recommendations, setRecommendations] = useState<JobRecommendationResult | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const generateRecommendations = async (forceRefresh = false) => {
        if (!id) return;

        setError("");
        setIsGenerating(true);

        try {
            if (!forceRefresh) {
                const cached = await kv.get(`jobs:${id}`);
                if (cached) {
                    setRecommendations(JSON.parse(cached));
                    setIsGenerating(false);
                    return;
                }
            }

            const resume = await kv.get(`resume:${id}`);
            if (!resume) {
                setError("Resume not found.");
                setIsGenerating(false);
                return;
            }

            const data = JSON.parse(resume) as Resume & { jobDescription?: string };
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
                                text: prepareJobRecommendationInstructions({
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
                setError("Could not generate recommendations.");
                setIsGenerating(false);
                return;
            }

            const parsed = parseRecommendationResponse(response.message.content);
            await kv.set(`jobs:${id}`, JSON.stringify(parsed));
            setRecommendations(parsed);
        } catch (err) {
            console.error(err);
            setError("Something went wrong while generating recommendations.");
        }

        setIsGenerating(false);
    };

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/jobs/${id}`);
        }
    }, [auth.isAuthenticated, id, isLoading, navigate]);

    useEffect(() => {
        if (!isLoading && auth.isAuthenticated) {
            generateRecommendations();
        }
    }, [auth.isAuthenticated, id, isLoading]);

    return (
        <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover px-6 py-8">
            <section className="max-w-6xl mx-auto flex flex-col gap-8">
                <nav className="flex items-center justify-between gap-4">
                    <Link to={`/resume/${id}`} className="back-button bg-white">
                        <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
                        <span className="text-gray-800 text-sm font-semibold">Back to Review</span>
                    </Link>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => generateRecommendations(true)}
                        disabled={isGenerating}
                    >
                        Refresh AI Picks
                    </button>
                </nav>

                <div className="page-heading !items-start !text-left">
                    <h1 className="text-4xl sm:text-5xl">Latest Job Recommendations</h1>
                    <h2 className="text-xl">
                        AI-matched roles based on your resume, resume score, and current hiring patterns.
                    </h2>
                </div>

                {isGenerating && (
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-8">
                        <img src="/images/resume-scan-2.gif" className="w-[220px]" alt="Generating" />
                        <p className="text-gray-600 font-semibold">Finding strong role matches...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-white rounded-2xl p-6 text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                {recommendations && !isGenerating && (
                    <div className="flex flex-col gap-6">
                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="!text-2xl !text-black font-bold">Resume Match Summary</h2>
                            <p className="text-gray-600 mt-2">{recommendations.resumeSummary}</p>
                        </section>

                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {recommendations.targetRoles.map((job) => (
                                <article key={job.title} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="!text-2xl !text-black font-bold">{job.title}</h2>
                                            <p className="text-gray-500">{job.seniority} • {job.locationType}</p>
                                        </div>
                                        <span className="score-badge bg-badge-green text-badge-green-text font-bold">
                                            {job.matchScore}%
                                        </span>
                                    </div>

                                    <p className="text-gray-700">{job.whyGoodFit}</p>

                                    <div className="flex flex-col gap-2">
                                        <p className="font-semibold text-gray-900">Highlight</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skillsToHighlight.map((skill) => (
                                                <span key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="font-semibold text-gray-900">Improve</p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skillsToImprove.map((skill) => (
                                                <span key={skill} className="rounded-full bg-badge-yellow px-3 py-1 text-sm text-badge-yellow-text">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <a
                                        href={job.searchUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="primary-button w-fit mt-auto"
                                    >
                                        Search Jobs
                                    </a>
                                </article>
                            ))}
                        </section>

                        <section className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="!text-2xl !text-black font-bold">Next Steps</h2>
                            <ul className="mt-3 flex flex-col gap-2 text-gray-700 list-disc pl-5">
                                {recommendations.nextSteps.map((step) => (
                                    <li key={step}>{step}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Jobs;
