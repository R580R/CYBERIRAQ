import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Proposal, Stats, Activity } from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { 
  DownloadCloud, 
  Filter, 
  TrendingUp, 
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";

const Analytics = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30days");
  const [chartType, setChartType] = useState("bar");

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({ 
    queryKey: ['/api/stats'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    }
  });

  // Fetch proposals for analytics
  const { data: proposals, isLoading: proposalsLoading } = useQuery<Proposal[]>({ 
    queryKey: ['/api/proposals'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch proposals data",
        variant: "destructive",
      });
    }
  });

  // Fetch activities for analytics
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({ 
    queryKey: ['/api/activities'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch activity data",
        variant: "destructive",
      });
    }
  });

  // Processing data for charts
  const statusDistribution = proposals ? [
    { name: "Draft", value: proposals.filter(p => p.status === "draft").length },
    { name: "Sent", value: proposals.filter(p => p.status === "sent").length },
    { name: "Viewed", value: proposals.filter(p => p.status === "viewed").length },
    { name: "Accepted", value: proposals.filter(p => p.status === "accepted").length },
    { name: "Declined", value: proposals.filter(p => p.status === "declined").length }
  ] : [];

  const viewsData = proposals ? proposals
    .filter(p => p.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(p => ({
      name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
      views: p.views
    })) : [];

  // Calculating acceptance rate
  const acceptanceRate = proposals ? {
    accepted: proposals.filter(p => p.status === "accepted").length,
    total: proposals.filter(p => p.status !== "draft").length
  } : { accepted: 0, total: 0 };

  const acceptanceRatePercent = acceptanceRate.total > 0 
    ? Math.round((acceptanceRate.accepted / acceptanceRate.total) * 100) 
    : 0;

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  const isLoading = statsLoading || proposalsLoading || activitiesLoading;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Analytics</h1>
            <p className="mt-1 text-sm text-neutral-600">Track and analyze your proposal performance</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center">
              <DownloadCloud className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden md:flex space-x-2 border rounded-md overflow-hidden">
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setChartType("bar")}
            >
              <BarChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === "pie" ? "default" : "ghost"}
              size="icon"
              className="rounded-none"
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Total Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProposals || 0}</div>
                <p className="text-xs text-success-600 mt-1 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>8.2% vs last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Accepted Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.acceptedProposals || 0}</div>
                <p className="text-xs text-success-600 mt-1 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>12.5% vs last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.proposalViews || 0}</div>
                <p className="text-xs text-success-600 mt-1 flex items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>23.1% vs last month</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-neutral-500">Acceptance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{acceptanceRatePercent}%</div>
                <p className="text-xs text-neutral-500 mt-1">
                  {acceptanceRate.accepted} out of {acceptanceRate.total} proposals
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : statusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-neutral-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Proposals</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : viewsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={viewsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#0F62FE" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-80 flex items-center justify-center text-neutral-500">
                    No view data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Proposals Tab */}
        <TabsContent value="proposals">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Creation Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : proposals && proposals.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={[
                      { name: 'Jan', count: 12 },
                      { name: 'Feb', count: 19 },
                      { name: 'Mar', count: 15 },
                      { name: 'Apr', count: 22 },
                      { name: 'May', count: 28 },
                      { name: 'Jun', count: 24 }
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#0F62FE" activeDot={{ r: 8 }} name="Proposals Created" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-neutral-500">
                  No proposal data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Views Tab */}
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Proposal View Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : proposals && proposals.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={[
                      { name: 'Mon', views: 45 },
                      { name: 'Tue', views: 32 },
                      { name: 'Wed', views: 38 },
                      { name: 'Thu', views: 42 },
                      { name: 'Fri', views: 35 },
                      { name: 'Sat', views: 20 },
                      { name: 'Sun', views: 25 }
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#42BE65" name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-neutral-500">
                  No view data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Conversion Tab */}
        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : proposals && proposals.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={[
                      { name: 'Created', count: proposals.length },
                      { name: 'Sent', count: proposals.filter(p => p.status !== "draft").length },
                      { name: 'Viewed', count: proposals.filter(p => p.views > 0).length },
                      { name: 'Accepted', count: proposals.filter(p => p.status === "accepted").length }
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#FF832B" name="Proposals" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-96 flex items-center justify-center text-neutral-500">
                  No conversion data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
