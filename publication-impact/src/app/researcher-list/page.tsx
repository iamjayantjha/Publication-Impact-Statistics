'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Researcher = {
    name: string;
    orcid: string;
    institution: string;
};

export default function ResearcherList() {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const router = useRouter();

    const [researchers, setResearchers] = useState<Researcher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (query) {
            fetch(`/api/researchers?query=${query}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setResearchers(data);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setError('Failed to fetch data');
                    setLoading(false);
                });
        }
    }, [query]);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Researchers List</h1>
            {researchers.length === 0 ? (
                <p className="text-center">No researchers found for "{query}"</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {researchers.map((researcher, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                            onClick={() => router.push(`/researcher/${researcher.orcid}`)}
                        >
                            <h2 className="text-lg font-bold text-blue-600 mb-2">
                                {researcher.name}
                            </h2>
                            <p className="text-sm text-gray-700">
                                <strong>Institution:</strong>{' '}
                                {researcher.institution !== 'N/A'
                                    ? researcher.institution
                                    : 'Not Available'}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>ORCID:</strong>{' '}
                                {researcher.orcid !== 'N/A' ? researcher.orcid : 'Not Available'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}