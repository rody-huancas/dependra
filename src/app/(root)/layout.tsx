import { Header } from "@/components/common/Header";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="pt-40 pb-10 text-foreground w-[80%] mx-auto">{children}</main>
    </>
  );
};

export default RootLayout;
