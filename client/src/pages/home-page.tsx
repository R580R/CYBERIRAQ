import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Book, Code, Server, Zap, Flame } from "lucide-react";
import { Link } from "wouter";
import { Course } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  
  // Fetch featured courses
  const { data: featuredCourses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/featured"],
  });

  // Hero section component
  const Hero = () => (
    <div className="relative overflow-hidden py-20 px-6 sm:px-10 md:px-12 bg-black">
      <div className="relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
            Master the Art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Cybersecurity</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Top-tier cybersecurity education platform offering practical skills training from industry experts. Elevate your cyber defense capabilities through immersive courses and real-world scenarios.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white"
            >
              <Link href="/courses">
                <Shield className="mr-2 h-5 w-5" />
                Browse Courses
              </Link>
            </Button>
            {!user && (
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-950 hover:text-white"
              >
                <Link href="/auth">
                  Sign Up Now
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Abstract background pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-y-0 right-1/4 w-1/3 bg-gradient-to-r from-transparent to-red-500 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 right-0 h-1/3 bg-gradient-to-t from-red-700 to-transparent blur-3xl" />
      </div>
    </div>
  );

  // Features section
  const Features = () => (
    <div className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Cyber Iraq</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            We provide comprehensive training in all areas of cybersecurity through an innovative learning platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard 
            icon={<Shield className="h-12 w-12 text-red-500" />}
            title="Penetration Testing"
            description="Learn ethical hacking techniques to identify and exploit security vulnerabilities before malicious hackers do."
          />
          <FeatureCard 
            icon={<Server className="h-12 w-12 text-red-500" />}
            title="Network Security"
            description="Master network security concepts, including firewalls, intrusion detection systems, and secure network architecture."
          />
          <FeatureCard 
            icon={<Code className="h-12 w-12 text-red-500" />}
            title="Secure Coding"
            description="Develop secure coding practices to build applications resistant to common vulnerabilities and attacks."
          />
          <FeatureCard 
            icon={<Zap className="h-12 w-12 text-red-500" />}
            title="Incident Response"
            description="Learn to effectively respond to security incidents, minimize damage, and restore systems quickly."
          />
          <FeatureCard 
            icon={<Book className="h-12 w-12 text-red-500" />}
            title="Digital Forensics"
            description="Gain skills in collecting, analyzing, and preserving digital evidence for cybersecurity investigations."
          />
          <FeatureCard 
            icon={<Flame className="h-12 w-12 text-red-500" />}
            title="Red Team Operations"
            description="Learn advanced offensive security techniques used by professional red teams to test organizational security."
          />
        </div>
      </div>
    </div>
  );

  // Feature card component
  const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center p-6 bg-black border border-gray-800 rounded-lg hover:border-red-800 transition-colors">
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );

  // Featured courses section
  const FeaturedCourses = () => (
    <div className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our most popular cybersecurity courses and start your learning journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-800" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded" />
                  <div className="h-4 bg-gray-800 rounded w-5/6" />
                  <div className="mt-6 h-10 bg-gray-800 rounded" />
                </div>
              </div>
            ))
          ) : featuredCourses && featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            // If no courses yet
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-400">No featured courses available yet. Check back soon!</p>
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            asChild
            size="lg" 
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white"
          >
            <Link href="/courses">
              View All Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );

  // Course card component
  const CourseCard = ({ course }: { course: Course }) => {
    // Get the appropriate icon based on course level
    const getLevelIcon = () => {
      switch (course.level) {
        case 'beginner':
          return <Shield className="h-4 w-4 text-green-400" />;
        case 'intermediate':
          return <Shield className="h-4 w-4 text-yellow-400" />;
        case 'advanced':
          return <Shield className="h-4 w-4 text-red-400" />;
        default:
          return <Shield className="h-4 w-4 text-gray-400" />;
      }
    };

    // Get the appropriate class for level badge
    const getLevelClass = () => {
      switch (course.level) {
        case 'beginner':
          return "absolute top-2 right-2 bg-green-900/60 backdrop-blur-sm text-xs font-medium rounded px-2 py-1 border border-green-700 text-green-300 flex items-center gap-1";
        case 'intermediate':
          return "absolute top-2 right-2 bg-yellow-900/60 backdrop-blur-sm text-xs font-medium rounded px-2 py-1 border border-yellow-700 text-yellow-300 flex items-center gap-1";
        case 'advanced':
          return "absolute top-2 right-2 bg-red-900/60 backdrop-blur-sm text-xs font-medium rounded px-2 py-1 border border-red-700 text-red-300 flex items-center gap-1";
        default:
          return "absolute top-2 right-2 bg-gray-900/60 backdrop-blur-sm text-xs font-medium rounded px-2 py-1 border border-gray-700 text-gray-300 flex items-center gap-1";
      }
    };

    return (
      <Card className="overflow-hidden bg-gray-900 border-gray-800 hover:border-red-700 hover:shadow-lg hover:shadow-red-900/10 hover:translate-y-[-5px] transition-transform transition-shadow transition-colors duration-300">
        <div className="h-48 bg-gray-900 relative overflow-hidden group">
          {course.imageUrl ? (
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
              <Shield className="h-16 w-16 text-red-500 opacity-50 group-hover:scale-110 transition-transform duration-300" />
            </div>
          )}
          <div className={getLevelClass()}>
            {getLevelIcon()}
            <span className="uppercase">{course.level}</span>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-white">{course.title}</CardTitle>
          <CardDescription className="text-gray-400 line-clamp-2">
            {course.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              <span className="text-red-500 font-bold">{course.duration}</span> minutes
            </div>
            <div>
              <span className="text-red-500 font-bold">{course.enrolledStudents || 0}</span> students
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            asChild
            className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 hover:scale-[1.02] transition-transform duration-200"
          >
            <Link href={`/courses/${course.slug}`}>
              Explore Course
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <Features />
      <FeaturedCourses />
    </div>
  );
}