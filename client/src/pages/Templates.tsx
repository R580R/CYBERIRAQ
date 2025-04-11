import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Template } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List
} from "lucide-react";
import TemplateCard from "@/components/dashboard/TemplateCard";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Templates = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  // Fetch templates
  const { data: templates, isLoading } = useQuery<Template[]>({ 
    queryKey: ['/api/templates'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  });

  // Filter templates based on search query and category
  const filteredTemplates = templates?.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      template.category?.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from templates
  const categories = templates
    ? ["all", ...new Set(templates.map(t => t.category || "Uncategorized"))]
    : ["all"];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Proposal Templates</h1>
            <p className="mt-1 text-sm text-neutral-600">Choose a template to start your proposal</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/templates/create">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-1 max-w-md">
            <div className="relative w-full">
              <Input
                type="text"
                className="pl-10"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
            </div>
            <Button variant="outline" className="ml-2 hidden md:flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="bg-neutral-200 h-8 w-px mx-1"></div>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none"
                onClick={() => setViewType("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Display */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className={`grid grid-cols-1 gap-6 ${viewType === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-40 animate-pulse bg-neutral-200 rounded-t-md" />
                  <div className="p-4">
                    <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                    <div className="h-3 animate-pulse bg-neutral-200 rounded w-full mb-4" />
                    <div className="flex justify-between">
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredTemplates && filteredTemplates.length > 0 ? (
            <div className={`grid grid-cols-1 gap-6 ${viewType === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-neutral-500 mb-4">No templates found matching your criteria.</p>
              <Button onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-40 animate-pulse bg-neutral-200 rounded-t-md" />
                  <div className="p-4">
                    <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                    <div className="h-3 animate-pulse bg-neutral-200 rounded w-full mb-4" />
                    <div className="flex justify-between">
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : templates ? (
            <div className={`grid grid-cols-1 gap-6 ${viewType === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {templates
                .filter(t => t.isPopular)
                .map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500">
              No popular templates available.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-40 animate-pulse bg-neutral-200 rounded-t-md" />
                  <div className="p-4">
                    <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                    <div className="h-3 animate-pulse bg-neutral-200 rounded w-full mb-4" />
                    <div className="flex justify-between">
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : templates ? (
            <div className={`grid grid-cols-1 gap-6 ${viewType === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
              {templates
                .filter(t => t.isNew)
                .map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500">
              No new templates available.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Templates;
