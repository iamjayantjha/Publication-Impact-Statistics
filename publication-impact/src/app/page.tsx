'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [query, setQuery] = useState(''); // State to store the search query
    const router = useRouter();

    const handleSearch = () => {
        if (query) {
            // Navigate to the researcher list page with the query as a URL parameter
            router.push(`/researcher-list?query=${query}`);
        } else {
            alert('Please enter a researcher name or ORCID!');
        }
    };

    return (
        <div className="text-center">
            <h1 className="text-2xl mb-4">Search Researcher</h1>
            <div className="flex justify-center items-center">
                <input
                    type="text"
                    placeholder="Enter Name or ORCID"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-1/3 text-black placeholder-gray-500"
                />
                <button
                    onClick={handleSearch}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Search
                </button>
            </div>
        </div>
    );
}