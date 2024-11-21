'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Researcher = {
    name: string;
    orcid: string;
    institution: string;
};

export default function ResearcherListContent() {
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
                <p className="text-center">No researchers found for &quot;{query}&quot;</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {researchers.map((researcher, index) => (
                        <div
                            key={index}
                            className={`p-4 border border-gray-300 rounded-lg shadow ${
                                researcher.orcid !== 'N/A' ? 'cursor-pointer hover:shadow-md' : 'opacity-50'
                            }`}
                            onClick={() => {
                                if (researcher.orcid !== 'N/A') {
                                    const orcid = researcher.orcid.startsWith('http')
                                        ? researcher.orcid.split('/').pop()
                                        : researcher.orcid;

                                    router.push(`/researcher/${orcid}`);
                                }
                            }}
                        >
                            <h2 className="text-lg font-bold text-blue-600 mb-2">{researcher.name}</h2>
                            <p className="text-sm text-gray-700">
                                <strong>Institution:</strong>{' '}
                                {researcher.institution !== 'N/A' ? researcher.institution : 'Not Available'}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>ORCID:</strong>{' '}
                                {researcher.orcid !== 'N/A' ? researcher.orcid : 'Not Available'}
                            </p>
                            {researcher.orcid === 'N/A' && (
                                <p className="text-xs text-red-500">ORCID unavailable</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}