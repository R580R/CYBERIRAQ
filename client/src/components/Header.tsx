import { useState } from "react";
import { Link, useLocation } from "wouter";
import { File, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <File className="text-primary h-6 w-6 mr-2" />
                <span className="font-bold text-xl text-neutral-800">ProposalPro</span>
              </div>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <NavLink href="/" isActive={isActive("/")}>Dashboard</NavLink>
              <NavLink href="/templates" isActive={isActive("/templates")}>Templates</NavLink>
              <NavLink href="/proposals" isActive={isActive("/proposals")}>Proposals</NavLink>
              <NavLink href="/analytics" isActive={isActive("/analytics")}>Analytics</NavLink>
              <NavLink href="/settings" isActive={isActive("/settings")}>Settings</NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative bg-neutral-50 rounded-full text-neutral-500 hover:text-neutral-700">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-destructive ring-2 ring-white"></span>
              </Button>
            </div>
            <div className="hidden sm:flex border-l border-neutral-200 h-6 mx-2"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium mr-2">
                    JD
                  </div>
                  <span className="ml-2 text-sm font-medium text-neutral-700 hidden md:block">John Doe</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-neutral-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Account Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 border-t border-neutral-200">
          <MobileNavLink href="/" isActive={isActive("/")}>Dashboard</MobileNavLink>
          <MobileNavLink href="/templates" isActive={isActive("/templates")}>Templates</MobileNavLink>
          <MobileNavLink href="/proposals" isActive={isActive("/proposals")}>Proposals</MobileNavLink>
          <MobileNavLink href="/analytics" isActive={isActive("/analytics")}>Analytics</MobileNavLink>
          <MobileNavLink href="/settings" isActive={isActive("/settings")}>Settings</MobileNavLink>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ href, isActive, children }: NavLinkProps) => {
  const activeClass = isActive
    ? "text-primary border-b-2 border-primary"
    : "text-neutral-600 hover:text-neutral-800";
  
  return (
    <Link href={href}>
      <a className={`${activeClass} px-1 py-4 text-sm font-medium`}>
        {children}
      </a>
    </Link>
  );
};

const MobileNavLink = ({ href, isActive, children }: NavLinkProps) => {
  const activeClass = isActive
    ? "bg-primary-50 border-l-4 border-primary text-primary-700"
    : "border-l-4 border-transparent text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-800";
  
  return (
    <Link href={href}>
      <a className={`${activeClass} block pl-3 pr-4 py-2 text-base font-medium`}>
        {children}
      </a>
    </Link>
  );
};

export default Header;
