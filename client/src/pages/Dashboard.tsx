import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  FileText, 
  CheckCircle, 
  Eye, 
  Clock, 
  ChevronRight, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StatsCard from "@/components/dashboard/StatsCard";
import TemplateCard from "@/components/dashboard/TemplateCard";
import ProposalItem from "@/components/dashboard/ProposalItem";
import ActivityItem from "@/components/dashboard/ActivityItem";
import { Template, Proposal, Activity, Stats } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({ 
    queryKey: ['/api/stats'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard stats",
        variant: "destructive",
      });
    }
  });

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery<Template[]>({ 
    queryKey: ['/api/templates'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    }
  });

  // Fetch recent proposals
  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({ 
    queryKey: ['/api/proposals/recent'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch recent proposals",
        variant: "destructive",
      });
    }
  });

  // Fetch recent activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({ 
    queryKey: ['/api/activities/recent'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch recent activities",
        variant: "destructive",
      });
    }
  });

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-600">Generate and manage your business proposals</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Link href="/proposals/new">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Proposal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-20 animate-pulse bg-neutral-200 rounded-md" />
                </CardContent>
              </Card>
            ))
          ) : stats ? (
            <>
              <StatsCard
                title="Total Proposals"
                value={stats.totalProposals}
                icon={<FileText />}
                iconBgColor="bg-primary-50"
                iconColor="text-primary-500"
                changeValue="8.2%"
                changeDirection="up"
                changeText="vs last month"
              />
              <StatsCard
                title="Accepted Proposals"
                value={stats.acceptedProposals}
                icon={<CheckCircle />}
                iconBgColor="bg-secondary-50"
                iconColor="text-secondary-500"
                changeValue="12.5%"
                changeDirection="up"
                changeText="vs last month"
              />
              <StatsCard
                title="Proposal Views"
                value={stats.proposalViews}
                icon={<Eye />}
                iconBgColor="bg-accent-50"
                iconColor="text-accent-500"
                changeValue="23.1%"
                changeDirection="up"
                changeText="vs last month"
              />
              <StatsCard
                title="Pending Approvals"
                value={stats.pendingApprovals}
                icon={<Clock />}
                iconBgColor="bg-destructive-50"
                iconColor="text-destructive-500"
                changeValue="2 new"
                changeDirection="up"
                changeText="since yesterday"
              />
            </>
          ) : (
            <div className="col-span-4 py-4 text-center text-neutral-500">
              No stats available
            </div>
          )}
        </div>
      </div>

      {/* Template Selector Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-900">Templates</h2>
          <Link href="/templates">
            <Button variant="link" className="text-primary-500 hover:text-primary-600 flex items-center">
              View all templates
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templatesLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="h-40 animate-pulse bg-neutral-200 rounded-t-md" />
                  <div className="p-4">
                    <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                    <div className="h-3 animate-pulse bg-neutral-200 rounded w-full mb-4" />
                    <div className="flex justify-between">
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                      <div className="h-6 animate-pulse bg-neutral-200 rounded w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : templates && templates.length > 0 ? (
            templates.slice(0, 3).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))
          ) : (
            <div className="col-span-3 py-4 text-center text-neutral-500">
              No templates available
            </div>
          )}
        </div>
      </div>

      {/* Recent Proposals & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Proposals */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-900">Recent Proposals</h2>
            <div className="flex">
              <div className="relative">
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
              <Button variant="outline" className="ml-3 flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <Card>
            <ul role="list" className="divide-y divide-neutral-200">
              {proposalsLoading ? (
                Array(4).fill(0).map((_, i) => (
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
                ))
              ) : proposals && proposals.length > 0 ? (
                proposals.map((proposal) => (
                  <ProposalItem key={proposal.id} proposal={proposal} />
                ))
              ) : (
                <li className="px-4 py-6 text-center text-neutral-500">
                  No proposals available
                </li>
              )}
            </ul>
            <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-neutral-700">
                  {proposals && proposals.length > 0 ? (
                    <>
                      Showing <span className="font-medium">{proposals.length}</span> of <span className="font-medium">{stats?.totalProposals || 0}</span> proposals
                    </>
                  ) : (
                    <span>No proposals to display</span>
                  )}
                </div>
                <Link href="/proposals">
                  <Button variant="link" className="text-primary-500 hover:text-primary-700 text-sm font-medium flex items-center">
                    View all proposals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Recent Activity</h2>
          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-900">Activity Feed</h3>
                <Link href="/analytics">
                  <Button variant="link" className="text-sm text-primary-500 hover:text-primary-700">
                    View all
                  </Button>
                </Link>
              </div>
            </div>
            <div className="px-4 py-3">
              <ul role="list" className="space-y-4">
                {activitiesLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <li key={i} className="relative pb-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 animate-pulse bg-neutral-200 rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 animate-pulse bg-neutral-200 rounded w-3/4 mb-2" />
                          <div className="h-3 animate-pulse bg-neutral-200 rounded w-full mb-2" />
                          <div className="h-3 animate-pulse bg-neutral-200 rounded w-1/4" />
                        </div>
                      </div>
                      {i < 3 && <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-neutral-200"></div>}
                    </li>
                  ))
                ) : activities && activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <ActivityItem 
                      key={activity.id} 
                      activity={activity} 
                      isLast={index === activities.length - 1} 
                    />
                  ))
                ) : (
                  <li className="py-4 text-center text-neutral-500">
                    No recent activity
                  </li>
                )}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
