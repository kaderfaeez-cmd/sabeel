import { Hero } from '@/components/home/hero';
import { Promise } from '@/components/home/promise';
import { SectionDirectory } from '@/components/home/section-directory';
import { ThreeDoors } from '@/components/home/three-doors';

export default function HomePage() {
  return (
    <>
      <Hero />
      {/* Before anything else: one question instead of a menu. */}
      <div className="py-section">
        <ThreeDoors />
      </div>
      <Promise />
      <SectionDirectory />
    </>
  );
}
