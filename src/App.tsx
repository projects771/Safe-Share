import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Workspace } from './components/workspace/Workspace';
import { HowItWorks } from './components/HowItWorks';
import { PrivacySecurity } from './components/PrivacySecurity';
import { PrivacyComparison } from './components/PrivacyComparison';
import { Creators } from './components/Creators';
import { Footer } from './components/Footer';

export function App() {
  const handleScrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-sans antialiased selection:bg-[#CCFF00] selection:text-[#000000]">
      {/* 1. Sticky Header Navigation */}
      <Header onStartRedacting={handleScrollToWorkspace} />

      <main>
        {/* 2. Hero Section */}
        <Hero onStartRedacting={handleScrollToWorkspace} />

        {/* 3. Main Redaction Workspace (Highest Priority) */}
        <Workspace />

        {/* 4. How It Works */}
        <HowItWorks />

        {/* 5. Privacy Comparison */}
        <PrivacyComparison />

        {/* 6. Privacy & Security */}
        <PrivacySecurity />

        {/* 7. About the Creators */}
        <Creators />
      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}

export default App;
