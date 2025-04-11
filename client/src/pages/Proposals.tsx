import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Proposal } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import ProposalItem from "@/components/dashboard/ProposalItem";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Proposals = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewType, setViewType] = useState<"grid" | "list">("list");

  // Fetch proposals
  const { data: proposals, isLoading } = useQuery<Proposal[]>({ 
    queryKey: ['/api/proposals'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch proposals",
        variant: "destructive",
      });
    }
  });

  // Filter and sort proposals
  const filteredProposals = proposals?.filter(proposal => {
    const matchesSearch = 
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "views") {
      return b.views - a.views;
    }
    return 0;
  });

  // Status options for filtering
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "viewed", label: "Viewed" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" }
  ];

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alphabetical", label: "Alphabetical" },
    { value: "views", label: "Most Viewed" }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Proposals</h1>
            <p className="mt-1 text-sm text-neutral-600">Manage and track all your business proposals</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/proposals/new">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Proposal
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
                placeholder="Search proposals..."
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

          <div className="flex items-center space-x-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="bg-neutral-200 h-8 w-px mx-1 hidden md:block"></div>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewType === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none"
                onClick={() => setViewType("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Display */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Proposals</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <Card>
              <ul className="divide-y divide-neutral-200">
                {Array(5).fill(0).map((_, i) => (
                  <li key={i} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 animate-pulse bg-neutral-200 rounded-md" />
                      <div className="ml-4 flex-1">
                        <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                        <div className="h-3 animate-pulse bg-neutral-200 rounded w-1/2" />
                      </div>
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-16" />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : filteredProposals && filteredProposals.length > 0 ? (
            <Card>
              <ul className="divide-y divide-neutral-200">
                {filteredProposals.map(proposal => (
                  <ProposalItem key={proposal.id} proposal={proposal} />
                ))}
              </ul>
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-t border-neutral-200">
                <div className="text-sm text-neutral-700">
                  Showing <span className="font-medium">{filteredProposals.length}</span> of <span className="font-medium">{proposals?.length || 0}</span> proposals
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="py-12 text-center">
              <p className="text-neutral-500 mb-4">No proposals found matching your criteria.</p>
              <Button onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
        
        {["draft", "sent", "accepted"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            {isLoading ? (
              <Card>
                <ul className="divide-y divide-neutral-200">
                  {Array(3).fill(0).map((_, i) => (
                    <li key={i} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 animate-pulse bg-neutral-200 rounded-md" />
                        <div className="ml-4 flex-1">
                          <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                          <div className="h-3 animate-pulse bg-neutral-200 rounded w-1/2" />
                        </div>
                        <div className="h-6 animate-pulse bg-neutral-200 rounded w-16" />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : proposals ? (
              <Card>
                <ul className="divide-y divide-neutral-200">
                  {proposals
                    .filter(p => p.status === status)
                    .map(proposal => (
                      <ProposalItem key={proposal.id} proposal={proposal} />
                    ))}
                </ul>
                {proposals.filter(p => p.status === status).length === 0 && (
                  <div className="py-8 text-center text-neutral-500">
                    No {status} proposals available.
                  </div>
                )}
              </Card>
            ) : (
              <div className="py-12 text-center text-neutral-500">
                No proposals available.
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Proposals;
