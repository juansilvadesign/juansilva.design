import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0F1217]">
      <Hero />
      <Projects />
      <Footer />
    </main>
  );
}
