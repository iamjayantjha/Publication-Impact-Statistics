import { NextResponse } from 'next/server';
import axios from 'axios';

// Define types for CrossRef API response structure
type Author = {
    ORCID?: string;
    given?: string;
    family?: string;
    affiliation?: { name: string }[];
};

type Paper = {
    title: string[];
    is_referenced_by_count: number;
    published?: { 'date-parts'?: number[][] };
    author?: Author[];
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orcid = searchParams.get('id'); // Extract ORCID from URL

    if (!orcid) {
        return NextResponse.json({ error: 'ORCID is required' }, { status: 400 });
    }

    try {
        const response = await axios.get<{ message: { items: Paper[] } }>(
            `https://api.crossref.org/works?filter=orcid:${orcid}`
        );

        const items = response.data.message.items;

        if (items.length === 0) {
            return NextResponse.json({ error: 'No data found for this ORCID' }, { status: 404 });
        }

        const author = items[0]?.author?.find(
            (a: Author) => a.ORCID === `https://orcid.org/${orcid}`
        );

        const papers = items.map((item: Paper) => ({
            title: item.title?.[0] || 'Untitled',
            citations: item.is_referenced_by_count || 0,
            year: item.published?.['date-parts']?.[0]?.[0] || 'Unknown',
        }));

        const totalCitations = papers.reduce((sum, paper) => sum + paper.citations, 0);

        const researcherDetails = {
            name: author ? `${author.given || ''} ${author.family || ''}`.trim() : 'Name not available',
            institution: author?.affiliation?.[0]?.name || 'Institution not available',
            orcid,
            totalPapers: papers.length,
            totalCitations,
            papers,
        };

        return NextResponse.json(researcherDetails, { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch researcher details' }, { status: 500 });
    }
}