import { Link } from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({ resume }: { resume: Resume }) => {
    return (
        <Link
            to={`/resume/${resume.id}`}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 flex flex-col gap-4 min-h-[550px]"
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-black font-bold text-lg break-words">
                        {resume.companyName}
                    </h2>
                    <h3 className="text-sm text-gray-500 break-words">
                        {resume.jobTitle}
                    </h3>
                </div>

                <ScoreCircle score={resume.feedback.overallScore} />
            </div>

            {/* Image */}
            <div className="rounded-lg overflow-hidden">
                <img
                    src={resume.imagePath}
                    alt="resume preview"
                    className="w-full h-[420px] sm:h-[450px] object-cover object-top"
                />
            </div>
        </Link>
    );
};

export default ResumeCard;