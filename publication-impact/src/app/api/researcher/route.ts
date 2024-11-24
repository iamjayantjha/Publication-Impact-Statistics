import { NextResponse } from 'next/server';
import axios from 'axios';

type Author = {
    ORCID?: string;
    given?: string;
    family?: string;
    affiliation?: { name: string }[];
};

type Paper = {
    title: string[];
    'is-referenced-by-count'?: number;
    published?: { 'date-parts'?: number[][] };
    author?: Author[];
    'container-title'?: string[];
    page?: string;
    type?: string;
    publisher?: string;
    DOI?: string;
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const orcid = searchParams.get('id'); // Extract ORCID from URL
    const fallbackName = searchParams.get('name'); // Fallback name from query
    const fallbackInstitution = searchParams.get('institution'); // Fallback institution from query

    if (!orcid) {
        return NextResponse.json({ error: 'ORCID is required' }, { status: 400 });
    }

    try {
        const response = await axios.get<{ message: { items: Paper[] } }>(
            `https://api.crossref.org/works?filter=orcid:${orcid}`
        );

        const items = response.data.message.items || [];
        console.log('Crossref API Items:', items); // Debugging API Response

        if (items.length === 0) {
            return NextResponse.json({ error: 'No data found for this ORCID' }, { status: 404 });
        }

        // Find the author matching the ORCID
        const author = items[0]?.author?.find(
            (a: Author) => a.ORCID?.endsWith(orcid)
        );

        const researcherDetails = {
            name: author
                ? `${author.given || ''} ${author.family || ''}`.trim()
                : fallbackName || 'Name not available',
            institution: author?.affiliation?.[0]?.name || fallbackInstitution || 'Institution not available',
            orcid,
            totalPapers: items.length,
            totalCitations: items.reduce((sum, paper) => sum + (paper['is-referenced-by-count'] || 0), 0),
            papers: items.map((item) => ({
                title: item.title?.[0] || 'Untitled',
                citations: item['is-referenced-by-count'] || 0,
                year: item.published?.['date-parts']?.[0]?.[0] || 'Unknown',
                fullDate: item.published?.['date-parts']?.[0]?.join('-') || 'Date not available',
                containerTitle: item['container-title']?.[0] || 'Container not available',
                pages: item.page || 'Pages not available',
                type: item.type || 'Type not available',
                publisher: item.publisher || 'Publisher not available',
                doi: item.DOI || 'DOI not available',
            })),
        };

        console.log('Researcher Details:', researcherDetails); // Debugging Output

        return NextResponse.json(researcherDetails, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch researcher details' }, { status: 500 });
    }
}