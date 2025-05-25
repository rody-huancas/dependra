import { Header } from "@/components/common/Header";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full overflow-y-auto">
      <Header />
      <main className="pt-40 pb-10 text-foreground w-[90%] md:w-[80%] mx-auto">{children}</main>
    </div>
  );
};

export default RootLayout;
