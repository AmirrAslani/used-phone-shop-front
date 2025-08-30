import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
        <main>{children}</main>
      <Footer />
    </>
  );
}
