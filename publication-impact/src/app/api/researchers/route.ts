import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query'); // Extract the query from the URL

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        // Call CrossRef API
        const response = await axios.get(
            `https://api.crossref.org/works?query.author=${query}`
        );

        // Map the response to a simplified format
        const researchers = response.data.message.items.map((item: any) => ({
            name: item.author?.[0]?.given + ' ' + item.author?.[0]?.family || 'N/A',
            orcid: item.author?.[0]?.ORCID || 'N/A',
            institution: item.author?.[0]?.affiliation?.[0]?.name || 'N/A',
        }));

        return NextResponse.json(researchers, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to fetch researcher data' },
            { status: 500 }
        );
    }
}