import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import EnterpriseBanner from "./EnterpriseBanner";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      <EnterpriseBanner />
      <Footer />
    </div>
  );
};

export default Layout;
