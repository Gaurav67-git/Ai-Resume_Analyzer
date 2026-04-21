import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import { useNavigate} from "react-router";
import {useEffect} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
    const { auth } = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    }, [auth.isAuthenticated]);
  return (
      <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />

        <section className="w-full px-6 py-16">
          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Track Your Applications & Resume Ratings
            </h1>
            <h2 className="text-gray-500 mt-2">
              Review your submissions and check AI-powered feedback.
            </h2>
          </div>

          {/* Cards */}
          {resumes.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 max-w-7xl mx-auto">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
          )}
        </section>
      </main>
  );
}