import HeroSection from "@/components/HeroSection/HeroSection";
import { FAQSchema, defaultFAQs } from "@/components/SEO/FAQSchema";
import { SoftwareAppSchema } from "@/components/SEO/SoftwareAppSchema";

const HomePage = () => {
  return (
    <>
      <FAQSchema faqs={defaultFAQs} />
      <SoftwareAppSchema />
      <div className="py-2">
        <HeroSection />
      </div>
    </>
  );
};

export default HomePage;
