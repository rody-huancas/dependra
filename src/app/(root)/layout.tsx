import { Header } from "@/components/common/Header";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="h-[200vh]">{children}</main>
    </>
  );
};

export default RootLayout;
