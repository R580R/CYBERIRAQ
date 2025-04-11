import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Shield,
  Book,
  Award,
  Clock,
  ChevronRight,
  Search, 
  Filter, 
  ArrowRight, 
  Terminal,
  Server,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Course, Enrollment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user enrollments
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<Enrollment[]>({
    queryKey: ['/api/user/enrollments'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch your enrolled courses",
        variant: "destructive",
      });
    }
  });

  // Fetch recommended courses
  const { data: recommendedCourses, isLoading: recommendedLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses/featured'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch recommended courses",
        variant: "destructive",
      });
    }
  });

  // Stats Card Component
  const StatsCard = ({ title, value, icon, description }: { 
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description: string;
  }) => (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-red-700 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start">
          <div className="mr-4 rounded-full p-2 bg-black border border-red-700">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Course Card Component
  const CourseCard = ({ course, progress = 0 }: { course: Course; progress?: number }) => (
    <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-red-700 transition-colors">
      <div className="h-40 bg-gray-800 relative">
        {course.imageUrl ? (
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
            <Shield className="h-16 w-16 text-red-500 opacity-50" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-black border border-red-500 text-red-500">
          {course.level}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-white text-lg">{course.title}</CardTitle>
        <CardDescription className="text-gray-400 line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div>
            <span className="text-red-500 font-bold">{course.duration}</span> minutes
          </div>
          <div>
            <span className="text-red-500 font-bold">{course.enrolledStudents || 0}</span> students
          </div>
        </div>
        {progress > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Progress</span>
              <span className="text-red-500 font-bold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1 bg-gray-800" indicatorClass="bg-gradient-to-r from-red-500 to-red-700" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          asChild
          className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
        >
          <Link href={`/courses/${course.slug}`}>
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back, {user?.fullName || user?.username}</h1>
            <p className="mt-2 text-gray-400">Track your progress and continue your cybersecurity journey</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button 
              asChild
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
            >
              <Link href="/courses">
                <Shield className="mr-2 h-5 w-5" /> 
                Browse All Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Enrolled Courses"
            value={enrollments?.length || 0}
            icon={<Book className="h-5 w-5 text-red-500" />}
            description="Total courses you've joined"
          />
          <StatsCard
            title="Completed Courses"
            value={0}
            icon={<Award className="h-5 w-5 text-red-500" />}
            description="Courses you've finished"
          />
          <StatsCard
            title="Hours Learned"
            value="0"
            icon={<Clock className="h-5 w-5 text-red-500" />}
            description="Total learning time"
          />
          <StatsCard
            title="CTF Points"
            value="0"
            icon={<Terminal className="h-5 w-5 text-red-500" />}
            description="Capture The Flag score"
          />
        </div>
      </div>

      {/* My Courses Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Courses</h2>
          <Link href="/user/courses">
            <Button variant="link" className="text-red-500 hover:text-red-400 flex items-center">
              View all my courses
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollmentsLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="h-40 bg-gray-800 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6" />
                  <div className="h-10 bg-gray-800 rounded animate-pulse mt-4" />
                </div>
              </Card>
            ))
          ) : enrollments && enrollments.length > 0 ? (
            enrollments.slice(0, 3).map((enrollment) => (
              <CourseCard 
                key={enrollment.id} 
                course={enrollment.course}
                progress={enrollment.progressPercentage || 0}
              />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center bg-gray-900 rounded-lg border border-gray-800">
              <Server className="h-12 w-12 text-red-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white mb-2">No Courses Yet</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">You haven't enrolled in any courses yet. Browse our catalog to start your cybersecurity journey.</p>
              <Button 
                asChild
                className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
              >
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recommended For You</h2>
          <div className="flex">
            <div className="relative hidden md:block">
              <Input
                type="text"
                className="pl-10 bg-gray-900 border-gray-700 text-white"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            <Button asChild variant="link" className="text-red-500 hover:text-red-400 flex items-center">
              <Link href="/courses">
                View all courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="h-40 bg-gray-800 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6" />
                  <div className="h-10 bg-gray-800 rounded animate-pulse mt-4" />
                </div>
              </Card>
            ))
          ) : recommendedCourses && recommendedCourses.length > 0 ? (
            recommendedCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-3 py-8 text-center">
              <Code className="h-12 w-12 text-red-500 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">No recommended courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
