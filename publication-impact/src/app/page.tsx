import Link from 'next/link';

export default function Home() {
  return (
      <div className="text-center">
        <h1 className="text-2xl">Search Researcher</h1>
        <Link href="/researcher-list">
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Go to Researcher List
          </button>
        </Link>
      </div>
  );
}