import { useState } from "react";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const EnterpriseBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary-50 border-t border-primary-100">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-primary-100">
              <Shield className="h-5 w-5 text-primary" />
            </span>
            <p className="ml-3 text-sm font-medium text-primary-700 truncate">
              <span className="hidden md:inline">Your enterprise account includes advanced security features and SSO capabilities.</span>
              <span className="inline md:hidden">Enterprise security enabled</span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <Button variant="outline" size="sm" className="text-primary-600 bg-white hover:bg-neutral-50">
              Configure settings
            </Button>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex p-2 rounded-md hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsVisible(false)}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5 text-primary-600" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseBanner;
