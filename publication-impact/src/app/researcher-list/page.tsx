'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

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

    return (
        <Suspense fallback={<p className="text-center text-lg">Loading...</p>}>
            <div className="p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Researchers List</h1>
                {loading && <p className="text-center text-lg">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {researchers.length === 0 && !loading && !error ? (
                    <p className="text-center">No researchers found for &quot;{query}&quot;</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {researchers.map((researcher, index) => (
                            <div
                                key={index}
                                className={`p-4 border border-gray-300 rounded-lg shadow ${
                                    researcher.orcid !== 'N/A'
                                        ? 'cursor-pointer hover:shadow-md'
                                        : 'opacity-50 cursor-not-allowed'
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
        </Suspense>
    );
}