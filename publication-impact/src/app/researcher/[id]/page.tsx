'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Paper = {
    title: string;
    citations: number;
    year: string;
};

type ResearcherDetails = {
    name: string;
    institution: string;
    orcid: string;
    totalPapers: number;
    totalCitations: number;
    papers: Paper[];
};

export default function ResearcherDetails() {
    const params = useParams();
    const id = params.id; // Extract the ORCID from the URL

    const [researcher, setResearcher] = useState<ResearcherDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch researcher details when the page loads
    useEffect(() => {
        if (id) {
            fetch(`/api/researcher?id=${id}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log('Fetched Data:', data); // Debugging log
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setResearcher(data);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Fetch Error:', err); // Debugging log
                    setError('Failed to fetch researcher details');
                    setLoading(false);
                });
        }
    }, [id]);

    // Render loading state
    if (loading) {
        return <p className="text-center">Loading...</p>;
    }

    // Render error state
    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    // Render fallback if no researcher data is available
    if (!researcher) {
        return <p className="text-center text-red-500">No researcher data available</p>;
    }

    // Render researcher details
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">{researcher.name}</h1>
            <p className="text-center">
                <strong>Institution:</strong> {researcher.institution}
            </p>
            <p className="text-center">
                <strong>ORCID:</strong> {researcher.orcid}
            </p>
            <p className="text-center">
                <strong>Total Papers:</strong> {researcher.totalPapers}
            </p>
            <p className="text-center">
                <strong>Total Citations:</strong> {researcher.totalCitations}
            </p>

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Papers</h2>
                <ul>
                    {researcher.papers.map((paper, index) => (
                        <li key={index} className="mb-2">
                            <strong>{paper.title}</strong> ({paper.year}) - Citations: {paper.citations}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}