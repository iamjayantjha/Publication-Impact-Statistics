'use client';

import React, { Suspense } from 'react';
import ResearcherListContent from './researcher-list-content';

export default function ResearcherListPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResearcherListContent />
        </Suspense>
    );
}