import './globals.css';

export const metadata = {
  title: 'Publication Impact Statistics',
  description: 'Analyze the impact of research using CrossRef API',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className="bg-gray-100">
      <header className="bg-blue-500 text-white py-4 text-center">
        <h1 className="text-xl">Publication Impact Statistics</h1>
      </header>
      <main className="p-4">{children}</main>
      </body>
      </html>
  );
}