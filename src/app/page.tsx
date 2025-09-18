import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#030712] text-white overflow-x-hidden">
      <Navbar />
      <div className="space-y-24 md:space-y-32 lg:space-y-40 px-6 md:px-10 lg:px-20 py-12">
        <Pricing />
        <Faq />
      </div>
      <Footer />
    </main>
  );
}