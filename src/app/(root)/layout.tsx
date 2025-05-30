import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { ProgressBarProvider } from "@/components/common/ProgressBarProvider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full overflow-y-auto container__layout">
      <ProgressBarProvider />

      <Header />

      <main className="pt-40 pb-10 text-foreground w-[90%] md:w-[80%] mx-auto">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
