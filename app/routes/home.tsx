import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {Link} from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Resumind" },
        { name: "description", content: "Smart feedback for your dream job!" },
    ];
}

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

export default function Home() {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const navigate = useNavigate();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    // 🔐 Auth check
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/");
        }
    }, [auth.isAuthenticated, isLoading, navigate]);

    // 📦 Load resumes from KV
    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            try {
                const kvItems = (await kv.list("resume:*", true)) as any[];

                const parsedResumes = kvItems?.map((item) =>
                    JSON.parse(item.value)
                );

                setResumes(parsedResumes || []);
            } catch (error) {
                console.error("Error loading resumes:", error);
            }

            setLoadingResumes(false);
        };

        loadResumes();
    }, []);

    const handleDeleteResume = async (resume: Resume) => {
        const shouldDelete = window.confirm("Remove this resume?");
        if (!shouldDelete) return;

        setResumes((current) => current.filter((item) => item.id !== resume.id));

        try {
            if (resume.resumePath) {
                await fs.delete(resume.resumePath);
            }

            if (resume.imagePath) {
                await fs.delete(resume.imagePath);
            }

            await kv.delete(`resume:${resume.id}`);
            await kv.delete(`jobs:${resume.id}`);
            await kv.delete(`optimized-resume:${resume.id}`);
            await kv.delete(`updated-resume-v2:${resume.id}`);
        } catch (error) {
            console.error("Error deleting resume:", error);
        }
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section px-6 py-16">
                {/* Heading */}
                <div className="page-heading py-16 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold">
                        Track Your Applications & Resume Ratings
                    </h1>

                    {/* Dynamic subheading */}
                    {loadingResumes ? (
                        <h2 className="text-gray-500 mt-2">
                            Loading your resumes...
                        </h2>
                    ) : resumes.length === 0 ? (
                        <h2 className="text-gray-500 mt-2">
                            No resumes found. Upload your first resume to get feedback.
                        </h2>
                    ) : (
                        <h2 className="text-gray-500 mt-2">
                            Review your submissions and check AI-powered feedback.
                        </h2>
                    )}
                </div>

                {/* 🔄 Loading animation */}
                {loadingResumes && (
                    <div className="flex flex-col items-center justify-center">
                        <img
                            src="/images/resume-scan-2.gif"
                            className="w-[200px]"
                            alt="loading"
                        />
                    </div>
                )}

                {/* 📂 Resume list */}
                {!loadingResumes && resumes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {resumes.map((resume) => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                onDelete={handleDeleteResume}
                            />
                        ))}
                    </div>
                )}

                {!loadingResumes && resumes?.length === 0 && (
                    <div className= "flex flex-col items-center justify-center mt-10 gap-4">
                        <Link to = "/upload" className = "primary-button w-fit text-xl font-semibold">
Upload Resume
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
