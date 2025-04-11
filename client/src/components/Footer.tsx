import { Link } from "wouter";
import { Shield, Twitter, Github, Linkedin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-gray-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer logo and description */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center mb-4">
            <Shield className="text-red-500 h-8 w-8 mr-2" />
            <span className="font-bold text-xl text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">CYBER</span>
              <span>IRAQ</span>
            </span>
          </div>
          <p className="text-gray-400 max-w-md text-center mb-6">
            Premium cybersecurity education platform offering hands-on training from industry experts.
          </p>
          <div className="flex space-x-4 mb-8">
            <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} label="Twitter" />
            <SocialLink href="https://github.com" icon={<Github size={18} />} label="GitHub" />
            <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" />
            <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} label="Facebook" />
            <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} label="Instagram" />
          </div>
        </div>

        {/* Footer navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <FooterSection title="Platform">
            <FooterLink href="/courses">All Courses</FooterLink>
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/certifications">Certifications</FooterLink>
            <FooterLink href="/enterprise">Enterprise</FooterLink>
          </FooterSection>

          <FooterSection title="Resources">
            <FooterLink href="/blog">Blog</FooterLink>
            <FooterLink href="/tutorials">Tutorials</FooterLink>
            <FooterLink href="/tools">Tools</FooterLink>
            <FooterLink href="/documentation">Documentation</FooterLink>
          </FooterSection>

          <FooterSection title="Company">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/partners">Partners</FooterLink>
          </FooterSection>

          <FooterSection title="Legal">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/security">Security</FooterLink>
            <FooterLink href="/compliance">Compliance</FooterLink>
          </FooterSection>
        </div>

        <div className="text-gray-500 text-sm text-center border-t border-gray-800 pt-8">
          <p>&copy; {year} Cyber Iraq. All rights reserved.</p>
          <p className="mt-2">Designed and developed with security in mind.</p>
          <p className="text-xs mt-4 text-gray-600">
            <span className="inline-block mx-1 font-mono bg-gray-900 px-1 rounded">❮Code❯</span>
            <span className="inline-block mx-1">with</span>
            <span className="inline-block mx-1 text-red-500">♥</span>
            <span className="inline-block mx-1">in Iraq</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection = ({ title, children }: FooterSectionProps) => (
  <div>
    <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">{title}</h3>
    <ul className="space-y-2">
      {children}
    </ul>
  </div>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => (
  <li>
    <Link href={href} className="text-gray-400 hover:text-red-500 transition-colors duration-200">
      {children}
    </Link>
  </li>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 bg-gray-900 rounded-full"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
