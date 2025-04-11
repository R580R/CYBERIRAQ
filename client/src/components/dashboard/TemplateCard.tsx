import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Template } from "@shared/schema";
import { Link } from "wouter";

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-neutral-200">
        <img 
          src={template.imageUrl || "https://via.placeholder.com/600x400?text=No+Image"} 
          alt={`${template.name} template preview`} 
          className="object-cover w-full h-40"
        />
        <div className="absolute inset-0 bg-primary-500 bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-neutral-900">{template.name}</h3>
        <p className="mt-1 text-sm text-neutral-600">{template.description}</p>
        <div className="mt-3 flex items-center justify-between">
          {template.isPopular && (
            <Badge variant="secondary" className="bg-primary-50 text-primary-700 hover:bg-primary-50">
              <Star className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          {template.isNew && (
            <Badge variant="secondary" className="bg-secondary-50 text-secondary-700 hover:bg-secondary-50">
              <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3L16 10L23 12L16 14L13 21L10 14L3 12L10 10L13 3Z" fill="currentColor" />
              </svg>
              New
            </Badge>
          )}
          {!template.isPopular && !template.isNew && (
            <Badge variant="outline" className="bg-neutral-100 text-neutral-700 hover:bg-neutral-100">
              Standard
            </Badge>
          )}
          <Link href={`/templates/${template.id}`}>
            <Button variant="link" className="text-primary-500 hover:text-primary-700">
              Use Template
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
