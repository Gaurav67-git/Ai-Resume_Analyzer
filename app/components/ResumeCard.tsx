import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

type Resume = {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath?: string;
    feedback: {
        overallScore: number;
    };
};

const ResumeCard = ({
    resume,
    onDelete,
}: {
    resume: Resume;
    onDelete?: (resume: Resume) => void;
}) => {
    const { fs } = usePuterStore();
    const [imageUrl, setImageUrl] = useState<string>("");

    const { companyName, jobTitle } = resume;

    useEffect(() => {
        let url: string | null = null;

        const loadImage = async () => {
            try {
                if (!resume?.imagePath) return;

                const blob = await fs.read(resume.imagePath);
                if (!blob) return;

                url = URL.createObjectURL(blob);
                setImageUrl(url);
            } catch (error) {
                console.error("Error loading image:", error);
            }
        };

        loadImage();

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [resume.imagePath]);

    return (
        <article className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 min-h-[550px]">
            {/* Header */}
            <Link to={`/resume/${resume.id}`} className="flex justify-between items-start">
                    <div>
                        {companyName && (
                            <h2 className="text-black font-bold text-lg break-words">
                                {companyName}
                            </h2>
                        )}

                        {jobTitle && companyName && (
                            <h3 className="text-sm text-gray-500 break-words">
                                {jobTitle}
                            </h3>
                        )}

                        {jobTitle && !companyName && (
                            <h2 className="text-black font-bold text-lg break-words">
                                {jobTitle}
                            </h2>
                        )}

                        {!companyName && !jobTitle && (
                            <h2 className="text-black font-bold">Resume</h2>
                        )}
                    </div>

                    <ScoreCircle score={resume.feedback?.overallScore || 0} />
            </Link>

            {/* Image */}
            <div className="relative rounded-lg overflow-hidden">
                <Link to={`/resume/${resume.id}`}>
                    <img
                        src={imageUrl || "/images/placeholder.png"}
                        alt="resume preview"
                        className="w-full h-[420px] sm:h-[450px] object-cover object-top"
                    />
                </Link>
                {onDelete && (
                    <button
                        type="button"
                        className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-badge-red"
                        onClick={() => onDelete(resume)}
                        aria-label="Remove resume"
                        title="Remove resume"
                    >
                        <img src="/icons/cross.svg" alt="" className="h-4 w-4" />
                    </button>
                )}
            </div>
        </article>
    );
};

export default ResumeCard;
