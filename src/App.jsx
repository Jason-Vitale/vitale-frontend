import Nav from './components/Nav';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import Platform from './components/Platform';
import FCCIngest from './components/FCCIngest';
import ComplianceMatrix from './components/ComplianceMatrix';
import AuditFeed from './components/AuditFeed';
import Enterprise from './components/Enterprise';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <Platform />
      <FCCIngest />
      <ComplianceMatrix />
      <AuditFeed />
      <Enterprise />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
}
