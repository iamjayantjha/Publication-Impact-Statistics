import { NextResponse } from 'next/server';
import axios from 'axios';

// Define types for researcher data
type Affiliation = {
    name: string;
};

type Author = {
    given?: string;
    family?: string;
    ORCID?: string;
    affiliation?: Affiliation[];
};

type CrossRefItem = {
    author?: Author[];
};

type CrossRefResponse = {
    message: {
        items: CrossRefItem[];
    };
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        // Fetch data from CrossRef API
        const response = await axios.get<CrossRefResponse>(
            `https://api.crossref.org/works?query.author=${query}`
        );

        const items = response.data.message.items;

        const researchers = items
            .flatMap((item) => item.author || [])
            .map((author) => ({
                name: `${author.given || ''} ${author.family || ''}`.trim() || 'Name not available',
                institution: author.affiliation?.[0]?.name || 'Institution not available',
                orcid: author.ORCID || 'ORCID not available',
            }));

        return NextResponse.json(researchers, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch researchers' }, { status: 500 });
    }
}