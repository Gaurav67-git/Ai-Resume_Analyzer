import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";

type Resume = {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    feedback: {
        overallScore: number;
    };
};

const ResumeCard = ({ resume }: { resume: Resume }) => {
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
        <Link
            to={`/resume/${resume.id}`}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 min-h-[550px]"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    {companyName && (
                        <h2 className="text-black font-bold text-lg break-words">
                            {companyName}
                        </h2>
                    )}

                    {jobTitle && (
                        <h3 className="text-sm text-gray-500 break-words">
                            {jobTitle}
                        </h3>
                    )}

                    {!companyName && !jobTitle && (
                        <h2 className="text-black font-bold">Resume</h2>
                    )}
                </div>

                <ScoreCircle score={resume.feedback?.overallScore || 0} />
            </div>

            {/* Image */}
            <div className="rounded-lg overflow-hidden">
                <img
                    src={imageUrl || "/images/placeholder.png"}
                    alt="resume preview"
                    className="w-full h-[420px] sm:h-[450px] object-cover object-top"
                />
            </div>
        </Link>
    );
};

export default ResumeCard;