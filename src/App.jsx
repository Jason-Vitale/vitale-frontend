import Nav from './components/Nav';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Modules from './components/Modules';
import Regulatory from './components/Regulatory';
import WhyVitale from './components/WhyVitale';
import WhoItsFor from './components/WhoItsFor';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Problem />
      <Modules />
      <Regulatory />
      <WhyVitale />
      <WhoItsFor />
      <CTA />
      <Footer />
    </>
  );
}
