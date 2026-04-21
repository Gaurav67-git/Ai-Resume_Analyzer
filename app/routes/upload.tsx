import { type FormEvent, useState } from "react";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    // ✅ FIXED (default should be false)
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);

            // ✅ Upload original file
            setStatusText("Uploading file...");
            const uploadFile = await fs.upload([file]);

            if (!uploadFile) {
                setStatusText("Error: Failed to upload file");
                setIsProcessing(false);
                return;
            }

            // ✅ Convert PDF → Image
            setStatusText("Converting to image...");
            const imageFile = await convertPdfToImage(file);

            console.log("Converted Image:", imageFile);

            if (!imageFile || !imageFile.file) {
                setStatusText("Error: Failed to convert PDF to image");
                setIsProcessing(false);
                return;
            }

            // ✅ Upload image
            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([imageFile.file]);

            if (!uploadedImage) {
                setStatusText("Error: Failed to upload image");
                setIsProcessing(false);
                return;
            }

            // ✅ Prepare data
            setStatusText("Preparing data...");
            const uuid = generateUUID();

            const data = {
                id: uuid,
                resumePath: uploadFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: "",
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // ✅ AI Analysis
            setStatusText("Analyzing...");
            const feedback = await ai.feedback(
                uploadFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback) {
                setStatusText("Error: Failed to analyze resume");
                setIsProcessing(false);
                return;
            }

            const feedbackText =
                typeof feedback.message.content === "string"
                    ? feedback.message.content
                    : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete! Redirecting...");
            console.log(data);
            navigate(`/resume/${uuid}`);

        } catch (error) {
            console.error(error);
            setStatusText("Something went wrong");
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) {
            setStatusText("Please upload a file first");
            return;
        }

        const formData = new FormData(e.currentTarget);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    };

    return (
        <main className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover">
            <section className="w-full px-6 py-16">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                                src="/images/resume-scan.gif"
                                alt=""
                                className="w-full"
                            />
                        </>
                    ) : (
                        <>
                            <h2>
                                Drop your resume for an ATS score and improvement tips
                            </h2>

                            {/* ✅ SHOW FORM ONLY WHEN NOT PROCESSING */}
                            <form
                                id="upload-form"
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 mt-8"
                            >
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input
                                        type="text"
                                        name="company-name"
                                        placeholder="Company Name"
                                        id="company-name"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input
                                        type="text"
                                        name="job-title"
                                        placeholder="Job Title"
                                        id="job-title"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description</label>
                                    <textarea
                                        rows={5}
                                        name="job-description"
                                        placeholder="Job Description"
                                        id="job-description"
                                    />
                                </div>

                                <div className="form-div">
                                    <label htmlFor="uploader">Upload Resume</label>
                                    <FileUploader onFileSelect={handleFileSelect} />
                                </div>

                                <button className="primary-button" type="submit">
                                    Analyze Resume
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;