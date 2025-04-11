import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Bell, ChevronDown, Menu, X, User, BookOpen, Code, Server, Layers, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== '/' && location.startsWith(path));
  };

  // Handle mobile menu toggling
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <Shield className="text-red-500 h-8 w-8 mr-2" />
                  <span className="font-bold text-xl text-white">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">CYBER</span>
                    <span className="glitch-effect">IRAQ</span>
                  </span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <NavLink href="/" isActive={isActive("/")}>Home</NavLink>
              <NavLink href="/courses" isActive={isActive("/courses")}>Courses</NavLink>
              <NavLink href="/blog" isActive={isActive("/blog")}>Blog</NavLink>
              <NavLink href="/tools" isActive={isActive("/tools")}>Tools</NavLink>
              <NavLink href="/about" isActive={isActive("/about")}>About</NavLink>
              {user && <NavLink href="/dashboard" isActive={isActive("/dashboard")}>Dashboard</NavLink>}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="text-white hover:bg-gray-800"
              >
                <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
            
            {user ? (
              <>
                {/* Notifications button */}
                <div className="relative hidden sm:block">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative bg-gray-900 rounded-full text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>
                  </Button>
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center text-white hover:bg-gray-800 pl-2">
                      <div className="h-8 w-8 rounded-full bg-red-900 flex items-center justify-center text-white font-medium">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-300 hidden md:block">
                        {user.username}
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border border-gray-800 text-white">
                    <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-red-500" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4 text-red-500" />
                      <span>My Courses</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                      <Settings className="mr-2 h-4 w-4 text-red-500" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      className="hover:bg-gray-800 cursor-pointer"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="ghost" className="text-white hover:bg-gray-800">
                  <Link href="/auth">Login</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800">
                  <Link href="/auth?tab=register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 z-30 bg-black bg-opacity-90 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="pt-16 pb-6 px-4 space-y-2">
          <MobileNavLink href="/" isActive={isActive("/")}>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-3" />
              <span>Home</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/courses" isActive={isActive("/courses")}>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 mr-3" />
              <span>Courses</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/blog" isActive={isActive("/blog")}>
            <div className="flex items-center">
              <Code className="h-5 w-5 mr-3" />
              <span>Blog</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/tools" isActive={isActive("/tools")}>
            <div className="flex items-center">
              <Server className="h-5 w-5 mr-3" />
              <span>Tools</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/about" isActive={isActive("/about")}>
            <div className="flex items-center">
              <Layers className="h-5 w-5 mr-3" />
              <span>About</span>
            </div>
          </MobileNavLink>
          {user && (
            <MobileNavLink href="/dashboard" isActive={isActive("/dashboard")}>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3" />
                <span>Dashboard</span>
              </div>
            </MobileNavLink>
          )}
          
          {!user && (
            <div className="pt-6 flex flex-col space-y-3">
              <Button asChild variant="outline" className="border-red-800 text-white">
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-red-500 to-red-700">
                <Link href="/auth?tab=register">Sign Up</Link>
              </Button>
            </div>
          )}
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
    ? "text-red-500 border-b-2 border-red-500"
    : "text-gray-300 hover:text-white border-b-2 border-transparent hover:border-gray-700";
  
  return (
    <Link href={href} className={`${activeClass} px-1 py-4 text-sm font-medium transition-colors duration-200`}>
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, isActive, children }: NavLinkProps) => {
  const activeClass = isActive
    ? "bg-gray-900 border-l-4 border-red-500 text-white"
    : "border-l-4 border-transparent text-gray-300 hover:bg-gray-900 hover:text-white";
  
  return (
    <Link href={href} className={`${activeClass} block pl-3 pr-4 py-3 text-base font-medium rounded-md transition-colors duration-200`}>
      {children}
    </Link>
  );
};

export default Header;
