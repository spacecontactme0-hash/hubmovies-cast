import Hero from "@/app/components/hero";
import JobsPreview from "@/app/components/jobs-preview";
import TalentsPreview from "@/app/components/talents-preview";

export default function Home() {
  return (
    <>
      <Hero />
      <JobsPreview />
      <TalentsPreview />
    </>
  );
}
