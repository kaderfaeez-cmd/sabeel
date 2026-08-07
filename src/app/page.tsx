import { Hero } from '@/components/home/hero';
import { Promise } from '@/components/home/promise';
import { SectionDirectory } from '@/components/home/section-directory';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Promise />
      <SectionDirectory />
    </>
  );
}
