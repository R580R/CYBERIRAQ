import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "wouter";
import { Shield, Lock } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";
  
  // Animation for the security shield in the background
  const ShieldBackground = () => (
    <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none opacity-10">
      <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <Shield className="w-96 h-96 text-red-600" strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2">
        <Lock className="w-64 h-64 text-red-800" strokeWidth={0.5} />
      </div>
    </div>
  );
  
  // We skip the regular layout on the auth page for a cleaner login/register experience
  if (isAuthPage) {
    return (
      <>
        <ShieldBackground />
        {children}
      </>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <ShieldBackground />
      
      {/* Network grid effect in the background */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(#ff000015_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
