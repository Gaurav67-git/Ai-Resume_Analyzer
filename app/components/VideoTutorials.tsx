type Tutorial = {
    id: string;
    title: string;
    description: string;
    duration: string;
    query: string;
    score: number;
};

const tutorialLibrary = (feedback: Feedback): Tutorial[] => [
    {
        id: "ats",
        title: "ATS resume formatting",
        description: "Learn how to format your resume so ATS scanners can read sections, keywords, and dates clearly.",
        duration: "10-15 min",
        query: "ATS friendly resume format tutorial",
        score: feedback.ATS.score,
    },
    {
        id: "content",
        title: "Write stronger resume bullets",
        description: "Improve weak bullet points with action verbs, measurable results, and role-specific impact.",
        duration: "8-12 min",
        query: "how to write strong resume bullet points tutorial",
        score: feedback.content.score,
    },
    {
        id: "structure",
        title: "Resume layout and structure",
        description: "See how to organize sections, spacing, headings, and ordering for a cleaner recruiter review.",
        duration: "8-10 min",
        query: "resume layout structure tutorial",
        score: feedback.structure.score,
    },
    {
        id: "skills",
        title: "Skills and keywords optimization",
        description: "Match your skills section to the job description without keyword stuffing or vague lists.",
        duration: "7-10 min",
        query: "resume skills keywords optimization tutorial",
        score: feedback.skills.score,
    },
    {
        id: "tone",
        title: "Professional resume tone",
        description: "Make your wording concise, confident, and specific while removing filler language.",
        duration: "6-9 min",
        query: "professional resume writing tone tutorial",
        score: feedback.toneAndStyle.score,
    },
];

const youtubeSearchUrl = (query: string) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

const VideoTutorials = ({ feedback }: { feedback: Feedback }) => {
    const tutorials = tutorialLibrary(feedback)
        .sort((first, second) => first.score - second.score)
        .slice(0, 3);

    return (
        <section className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5">
            <div>
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                    Video tutorials
                </p>
                <h2 className="!text-2xl !text-black font-bold mt-1">
                    Learn how to improve this resume
                </h2>
                <p className="text-gray-600 mt-2">
                    These tutorials are picked from the lowest scoring parts of your resume feedback.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {tutorials.map((tutorial) => (
                    <a
                        key={tutorial.id}
                        href={youtubeSearchUrl(tutorial.query)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                            <div className="size-14 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="ml-1 text-indigo-600 text-2xl">▶</span>
                            </div>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {tutorial.title}
                                </h3>
                                <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                                    {tutorial.duration}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-6">
                                {tutorial.description}
                            </p>
                            <p className="text-sm font-semibold text-indigo-600 mt-1">
                                Watch tutorial
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default VideoTutorials;
