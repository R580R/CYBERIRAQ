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
  const [location, setLocation] = useLocation();
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
    <header className="bg-black bg-opacity-95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <Shield className="text-red-500 h-8 w-8 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-red-500 rounded-full filter blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  </div>
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
              {user?.role === "admin" && <NavLink href="/admin" isActive={isActive("/admin")}>Admin</NavLink>}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="text-white hover:bg-gray-800/70 hover:scale-105 transition-all duration-200"
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
                    className="relative bg-gray-900/80 hover:bg-gray-800 rounded-full text-gray-300 hover:text-white hover:scale-105 transition-all duration-200"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black animate-pulse"></span>
                  </Button>
                </div>
                
                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center text-white hover:bg-gray-800/70 pl-2 hover:scale-105 transition-all duration-200"
                    >
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-medium ring-2 ring-red-900/30">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-300 hidden md:block">
                        {user.username}
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 text-white shadow-xl shadow-black/50 rounded-lg overflow-hidden animate-in slide-in-from-top-3 duration-300">
                    <DropdownMenuItem className="hover:bg-gray-800 hover:text-red-100 cursor-pointer transition-colors duration-200 focus:bg-gray-800">
                      <User className="mr-2 h-4 w-4 text-red-500" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 hover:text-red-100 cursor-pointer transition-colors duration-200 focus:bg-gray-800">
                      <BookOpen className="mr-2 h-4 w-4 text-red-500" />
                      <span>My Courses</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-800 hover:text-red-100 cursor-pointer transition-colors duration-200 focus:bg-gray-800">
                      <Settings className="mr-2 h-4 w-4 text-red-500" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    
                    {user.role === "admin" && (
                      <DropdownMenuItem 
                        className="hover:bg-gray-800 hover:text-red-100 cursor-pointer transition-colors duration-200 focus:bg-gray-800"
                        asChild
                      >
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4 text-red-500" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem 
                      className="hover:bg-red-900/70 hover:text-white cursor-pointer transition-colors duration-200 focus:bg-red-900/70"
                      onClick={() => logoutMutation.mutate()}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-400" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="ghost" className="text-white hover:bg-gray-800/70 hover:text-red-100 hover:scale-105 transition-all duration-200">
                  <Link href="/auth">Login</Link>
                </Button>
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 hover:shadow-lg hover:shadow-red-900/30 hover:scale-105 transition-all duration-200"
                >
                  <Link href="/auth?tab=register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 z-30 bg-gradient-to-b from-black to-gray-900 bg-opacity-95 backdrop-blur-sm transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto top-0' : 'opacity-0 pointer-events-none -top-full'
        }`}
        style={{ height: "100vh" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 via-transparent to-transparent"></div>
        
        <div className="relative pt-20 pb-6 px-4 space-y-1 overflow-y-auto max-h-screen">
          <div className="mb-6 px-3">
            <div className="h-0.5 w-12 bg-gradient-to-r from-red-500 to-transparent mb-6"></div>
            <h3 className="text-lg font-bold text-white mb-1">Navigation</h3>
            <p className="text-sm text-gray-400">Access our cybersecurity resources</p>
          </div>
          
          <MobileNavLink href="/" isActive={isActive("/")}>
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                <Shield className="h-4 w-4 text-red-500" />
              </div>
              <span>Home</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/courses" isActive={isActive("/courses")}>
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                <BookOpen className="h-4 w-4 text-red-500" />
              </div>
              <span>Courses</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/blog" isActive={isActive("/blog")}>
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                <Code className="h-4 w-4 text-red-500" />
              </div>
              <span>Blog</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/tools" isActive={isActive("/tools")}>
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                <Server className="h-4 w-4 text-red-500" />
              </div>
              <span>Tools</span>
            </div>
          </MobileNavLink>
          <MobileNavLink href="/about" isActive={isActive("/about")}>
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                <Layers className="h-4 w-4 text-red-500" />
              </div>
              <span>About</span>
            </div>
          </MobileNavLink>
          
          {user && (
            <>
              <MobileNavLink href="/dashboard" isActive={isActive("/dashboard")}>
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                    <User className="h-4 w-4 text-red-500" />
                  </div>
                  <span>Dashboard</span>
                </div>
              </MobileNavLink>
              
              {user.role === "admin" && (
                <MobileNavLink href="/admin" isActive={isActive("/admin")}>
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-gray-800 mr-3">
                      <Shield className="h-4 w-4 text-red-500" />
                    </div>
                    <span>Admin</span>
                  </div>
                </MobileNavLink>
              )}
            </>
          )}
          
          {!user && (
            <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col space-y-3 px-3">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Join Cyber Iraq today</h3>
              <Button 
                asChild 
                variant="outline" 
                className="border-red-800/50 text-white hover:bg-gray-800 hover:border-red-700 transition-colors duration-200"
              >
                <Link href="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Login to Account
                </Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 shadow-lg shadow-red-900/20"
              >
                <Link href="/auth?tab=register">
                  <Shield className="h-4 w-4 mr-2" />
                  Create Account
                </Link>
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
  const baseClasses = "px-3 py-2 mx-1 text-sm font-medium rounded-md transition-all duration-300";
  const activeClass = isActive
    ? `${baseClasses} text-white bg-gradient-to-r from-red-600 to-red-800 shadow-sm shadow-red-900/30`
    : `${baseClasses} text-gray-300 hover:text-white hover:bg-gray-800/50 hover:scale-105`;
  
  return (
    <Link href={href} className={activeClass}>
      {children}
    </Link>
  );
};

const MobileNavLink = ({ href, isActive, children }: NavLinkProps) => {
  const activeClass = isActive
    ? "bg-gray-900/70 border-l-2 border-red-500 text-white shadow-sm"
    : "border-l-2 border-transparent text-gray-300 hover:bg-gray-900/50 hover:text-white hover:border-red-500/30";
  
  return (
    <Link 
      href={href} 
      className={`${activeClass} block pl-3 pr-4 py-3 text-base font-medium rounded-md transition-all duration-200 mb-1 hover:translate-x-1`}
    >
      {children}
    </Link>
  );
};

export default Header;
