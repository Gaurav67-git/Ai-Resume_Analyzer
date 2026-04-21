import { useParams } from "react-router";

const Results = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Resume Analysis Result</h1>
            <p>ID: {id}</p>
        </div>
    );
};

export default Results;