import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const metadata = {
  title: 'FlyRank Frontend AI Studio — Production Capstone Skeleton',
  description: 'Enterprise-grade Frontend AI platform featuring Generative UI, streaming completions, multimodal interfaces, and FinOps telemetry.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-[#f8fafc] antialiased selection:bg-sky-500 selection:text-white flex flex-col">
        {/* Responsive Navigation Header */}
        <Navbar />

        {/* Main Routed Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
