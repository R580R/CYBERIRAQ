import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ExternalLink,
  Trash2,
  Sparkles,
  Book,
  LucideIcon,
  CheckCircle2,
  FileText,
  Dumbbell,
  BookOpen,
  Brain,
  Gauge,
  Lightbulb,
  Zap,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("courses");

  // Redirect if not admin
  if (user && user.role !== "admin") {
    setLocation("/");
    toast({
      title: "Access denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text">
        Admin Dashboard
      </h1>
      <p className="text-gray-400 mb-8">
        Manage your courses, sections, lessons, and contact messages
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          <TabsTrigger value="ai">AI Enhancement</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <CourseManagement />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="messages">
          <MessageManagement />
        </TabsContent>

        <TabsContent value="ai">
          <AIEnhancement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseManagement() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const { data: courses = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/courses"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button onClick={() => alert("Not implemented yet")}>
          Add New Course
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course: any) => (
          <Card key={course.id} className="overflow-hidden border-zinc-800 bg-zinc-950">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge className="mb-2">{course.level}</Badge>
                <Badge variant="outline">{course.category.replace(/_/g, ' ')}</Badge>
              </div>
              <CardTitle className="line-clamp-1 text-xl font-bold">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2 text-sm text-gray-400">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Enrollments:</span>
                <span className="font-medium text-white">{course.enrollments || 0}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation(`/courses/${course.slug}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      course and all its sections and lessons.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteMutation.mutate(course.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function UserManagement() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      <p className="text-gray-400">
        User management functionality will be implemented in a future update.
      </p>
    </div>
  );
}

function MessageManagement() {
  const { toast } = useToast();
  
  const { data: messages = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/contact-messages"],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/admin/contact-messages/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark message as read",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/contact-messages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
      
      <Table>
        <TableCaption>A list of all contact form submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages?.map((message: any) => (
            <TableRow key={message.id} className={message.read ? "" : "bg-zinc-900"}>
              <TableCell>
                {message.read ? (
                  <Badge variant="outline">Read</Badge>
                ) : (
                  <Badge className="bg-red-600">New</Badge>
                )}
              </TableCell>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>{message.email}</TableCell>
              <TableCell className="max-w-xs truncate">{message.message}</TableCell>
              <TableCell>
                {new Date(message.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {!message.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsReadMutation.mutate(message.id)}
                    disabled={markAsReadMutation.isPending}
                  >
                    {markAsReadMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Mark as Read"
                    )}
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        contact message.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMessageMutation.mutate(message.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deleteMessageMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {messages?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-400">
                No messages found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

function FeatureCard({ title, description, icon: Icon, onClick }: FeatureCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:border-red-500 transition-all duration-300 border-zinc-800 bg-zinc-950"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <Icon className="h-8 w-8 text-red-500" />
          <Badge variant="outline">AI Powered</Badge>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function AIEnhancement() {
  const [activeFeature, setActiveFeature] = useState<
    | "content-suggestions"
    | "exercise-enhancement"
    | "course-structure"
    | "technical-verification"
    | null
  >(null);
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-red-500" />
        <h2 className="text-2xl font-bold">AI-Powered Content Enhancement</h2>
      </div>
      
      {!activeFeature ? (
        <div>
          <p className="text-gray-400 mb-8">
            Use artificial intelligence to enhance your courses, lessons, and exercises. Select
            a feature to get started.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="Content Suggestions"
              description="Get AI-powered suggestions to improve the quality, clarity, and engagement of your course content."
              icon={LightbulbIcon}
              onClick={() => setActiveFeature("content-suggestions")}
            />
            
            <FeatureCard
              title="Exercise Enhancement"
              description="Transform your exercises with detailed descriptions, hints, and real-world applications."
              icon={Dumbbell}
              onClick={() => setActiveFeature("exercise-enhancement")}
            />
            
            <FeatureCard
              title="Course Structure Analysis"
              description="Analyze your course structure for gaps, sequencing issues, and improvement opportunities."
              icon={BookOpen}
              onClick={() => setActiveFeature("course-structure")}
            />
            
            <FeatureCard
              title="Technical Accuracy Verification"
              description="Verify the technical accuracy of your cybersecurity content with AI analysis."
              icon={CheckCircle2}
              onClick={() => setActiveFeature("technical-verification")}
            />
          </div>
        </div>
      ) : (
        <div>
          <Button
            variant="outline"
            onClick={() => setActiveFeature(null)}
            className="mb-6"
          >
            Back to Features
          </Button>
          
          {activeFeature === "content-suggestions" && <ContentSuggestions />}
          {activeFeature === "exercise-enhancement" && <ExerciseEnhancement />}
          {activeFeature === "course-structure" && <CourseStructureAnalysis />}
          {activeFeature === "technical-verification" && <TechnicalVerification />}
        </div>
      )}
    </div>
  );
}

function ContentSuggestions() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"course" | "lesson" | "exercise">("course");
  const [suggestions, setSuggestions] = useState<any>(null);
  
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/content-suggestions", {
        title,
        content,
        contentType,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setSuggestions(data);
      toast({
        title: "Suggestions generated",
        description: "Content suggestions have been generated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to generate suggestions",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <LightbulbIcon className="h-5 w-5 text-yellow-500" />
        Content Suggestions
      </h3>
      
      <p className="text-gray-400 mb-6">
        Get AI-powered suggestions to improve your content's quality, clarity, engagement, and technical accuracy.
      </p>
      
      <div className="grid gap-6 mb-6">
        <div>
          <Label htmlFor="content-type">Content Type</Label>
          <Select 
            value={contentType} 
            onValueChange={(value) => setContentType(value as any)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="lesson">Lesson</SelectItem>
              <SelectItem value="exercise">Exercise</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter content title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Enter your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] mt-1"
          />
        </div>
        
        <Button
          onClick={() => generateMutation.mutate()}
          disabled={generateMutation.isPending || !title || !content}
          className="w-full"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Suggestions
            </>
          )}
        </Button>
      </div>
      
      {suggestions && (
        <div className="border border-zinc-800 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-bold mb-4">Content Enhancement Suggestions</h4>
          
          <div className="mb-6">
            <h5 className="font-semibold text-red-500 mb-2">Overall Recommendation</h5>
            <p className="text-gray-300">{suggestions.overallRecommendation}</p>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-green-500 mb-2">Content Strengths</h5>
            <ul className="list-disc pl-5 space-y-1">
              {suggestions.strengths.map((strength: string, index: number) => (
                <li key={index} className="text-gray-300">{strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-yellow-500 mb-2">Improvement Suggestions</h5>
            <div className="space-y-4">
              {suggestions.suggestions.map((suggestion: any, index: number) => (
                <Card key={index} className="border-zinc-800 bg-zinc-950">
                  <CardHeader className="py-4">
                    <CardTitle className="text-base">{suggestion.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="mb-2">
                      <span className="text-gray-400">Issue: </span>
                      <span>{suggestion.issue}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Recommendation: </span>
                      <span>{suggestion.recommendation}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseEnhancement() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [enhancedExercise, setEnhancedExercise] = useState<any>(null);
  
  const enhanceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/enhance-exercise", {
        title,
        description,
        difficulty,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setEnhancedExercise(data);
      toast({
        title: "Exercise enhanced",
        description: "Exercise has been enhanced successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to enhance exercise",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Dumbbell className="h-5 w-5 text-orange-500" />
        Exercise Enhancement
      </h3>
      
      <p className="text-gray-400 mb-6">
        Transform your exercises with detailed descriptions, hints, learning objectives, and real-world applications.
      </p>
      
      <div className="grid gap-6 mb-6">
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select 
            value={difficulty} 
            onValueChange={(value) => setDifficulty(value as any)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="exercise-title">Exercise Title</Label>
          <Input
            id="exercise-title"
            placeholder="Enter exercise title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="description">Current Description</Label>
          <Textarea
            id="description"
            placeholder="Enter your current exercise description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] mt-1"
          />
        </div>
        
        <Button
          onClick={() => enhanceMutation.mutate()}
          disabled={enhanceMutation.isPending || !title || !description}
          className="w-full"
        >
          {enhanceMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enhancing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Enhance Exercise
            </>
          )}
        </Button>
      </div>
      
      {enhancedExercise && (
        <div className="border border-zinc-800 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-bold mb-4">Enhanced Exercise</h4>
          
          <div className="mb-6">
            <h5 className="font-semibold text-orange-500 mb-2">Enhanced Description</h5>
            <p className="text-gray-300 whitespace-pre-line">{enhancedExercise.enhancedDescription}</p>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-blue-500 mb-2">Learning Objectives</h5>
            <ul className="list-disc pl-5 space-y-1">
              {enhancedExercise.learningObjectives.map((objective: string, index: number) => (
                <li key={index} className="text-gray-300">{objective}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-yellow-500 mb-2">Hints</h5>
            <div className="space-y-2">
              {enhancedExercise.hints.map((hint: any, index: number) => (
                <div key={index} className="p-3 bg-zinc-900 rounded-md">
                  <span className="text-red-500 font-medium">Level {hint.level}: </span>
                  <span className="text-gray-300">{hint.hint}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-green-500 mb-2">Security Concepts</h5>
            <div className="flex flex-wrap gap-2">
              {enhancedExercise.securityConcepts.map((concept: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-zinc-900">
                  {concept}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold text-purple-500 mb-2">Real-World Application</h5>
            <p className="text-gray-300">{enhancedExercise.realWorldApplication}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseStructureAnalysis() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<{ title: string; description: string }[]>([
    { title: "", description: "" },
  ]);
  const [analysis, setAnalysis] = useState<any>(null);
  
  const addSection = () => {
    setSections([...sections, { title: "", description: "" }]);
  };
  
  const removeSection = (index: number) => {
    if (sections.length > 1) {
      const newSections = [...sections];
      newSections.splice(index, 1);
      setSections(newSections);
    }
  };
  
  const updateSection = (index: number, field: "title" | "description", value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };
  
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/analyze-course-structure", {
        title,
        sections,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Analysis complete",
        description: "Course structure analysis has been completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to analyze course structure",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-blue-500" />
        Course Structure Analysis
      </h3>
      
      <p className="text-gray-400 mb-6">
        Analyze your course structure for gaps, sequencing issues, redundancies, and improvement opportunities.
      </p>
      
      <div className="grid gap-6 mb-6">
        <div>
          <Label htmlFor="course-title">Course Title</Label>
          <Input
            id="course-title"
            placeholder="Enter course title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Course Sections</Label>
            <Button variant="outline" size="sm" onClick={addSection}>
              Add Section
            </Button>
          </div>
          
          {sections.map((section, index) => (
            <div key={index} className="border border-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h6 className="font-medium">Section {index + 1}</h6>
                {sections.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSection(index)}
                    className="text-red-500 h-8 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`section-${index}-title`} className="text-sm">Title</Label>
                  <Input
                    id={`section-${index}-title`}
                    placeholder="Section title"
                    value={section.title}
                    onChange={(e) => updateSection(index, "title", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`section-${index}-description`} className="text-sm">Description</Label>
                  <Textarea
                    id={`section-${index}-description`}
                    placeholder="Section description"
                    value={section.description}
                    onChange={(e) => updateSection(index, "description", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          onClick={() => analyzeMutation.mutate()}
          disabled={
            analyzeMutation.isPending ||
            !title ||
            sections.some((s) => !s.title || !s.description)
          }
          className="w-full"
        >
          {analyzeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Analyze Structure
            </>
          )}
        </Button>
      </div>
      
      {analysis && (
        <div className="border border-zinc-800 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-bold mb-4">Course Structure Analysis</h4>
          
          <div className="mb-6">
            <h5 className="font-semibold text-blue-500 mb-2">Structural Suggestions</h5>
            <div className="space-y-3">
              {analysis.structuralSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="p-3 bg-zinc-900 rounded-md">
                  <div className="text-gray-400 mb-1">Issue: {suggestion.issue}</div>
                  <div className="text-gray-300">Recommendation: {suggestion.recommendation}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-yellow-500 mb-2">Gap Analysis</h5>
            <div className="space-y-3">
              {analysis.gapAnalysis.map((gap: any, index: number) => (
                <Card key={index} className="border-zinc-800 bg-zinc-950">
                  <CardHeader className="py-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{gap.missingTopic}</CardTitle>
                      <Badge variant="outline" className="bg-zinc-900">
                        {gap.importance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-0 pb-3">
                    <p className="text-gray-300">{gap.recommendation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {analysis.suggestedNewSections.length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold text-green-500 mb-2">Suggested New Sections</h5>
              <div className="space-y-3">
                {analysis.suggestedNewSections.map((section: any, index: number) => (
                  <Card key={index} className="border-zinc-800 bg-zinc-950">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                      <div className="mb-2">
                        <span className="text-gray-400">Description: </span>
                        <span className="text-gray-300">{section.description}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Rationale: </span>
                        <span className="text-gray-300">{section.rationale}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TechnicalVerification() {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<
    "networking" | "cryptography" | "pentest" | "malware" | "general"
  >("general");
  const [verification, setVerification] = useState<any>(null);
  
  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/ai/verify-accuracy", {
        content,
        contentType,
      });
      return await res.json();
    },
    onSuccess: (data) => {
      setVerification(data);
      toast({
        title: "Verification complete",
        description: "Technical content verification has been completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to verify content",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        Technical Accuracy Verification
      </h3>
      
      <p className="text-gray-400 mb-6">
        Verify the technical accuracy of your cybersecurity content with AI analysis.
      </p>
      
      <div className="grid gap-6 mb-6">
        <div>
          <Label htmlFor="content-type">Content Domain</Label>
          <Select 
            value={contentType} 
            onValueChange={(value) => setContentType(value as any)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select content domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="networking">Networking</SelectItem>
              <SelectItem value="cryptography">Cryptography</SelectItem>
              <SelectItem value="pentest">Penetration Testing</SelectItem>
              <SelectItem value="malware">Malware Analysis</SelectItem>
              <SelectItem value="general">General Cybersecurity</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="content-to-verify">Content to Verify</Label>
          <Textarea
            id="content-to-verify"
            placeholder="Enter technical content to verify..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] mt-1"
          />
        </div>
        
        <Button
          onClick={() => verifyMutation.mutate()}
          disabled={verifyMutation.isPending || !content}
          className="w-full"
        >
          {verifyMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Verify Technical Accuracy
            </>
          )}
        </Button>
      </div>
      
      {verification && (
        <div className="border border-zinc-800 rounded-lg p-6 mt-8">
          <h4 className="text-lg font-bold mb-4">Technical Verification Results</h4>
          
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <h5 className="font-semibold text-blue-500">Accuracy Score</h5>
              <div className="relative h-6 w-full max-w-[200px] bg-zinc-800 rounded-full overflow-hidden ml-4">
                <div 
                  className={`absolute top-0 left-0 h-full ${
                    verification.accuracyScore >= 8 ? 'bg-green-500' : 
                    verification.accuracyScore >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(verification.accuracyScore / 10) * 100}%` }}
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium">
                  {verification.accuracyScore}/10
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-red-500 mb-2">Inaccuracies</h5>
            <div className="space-y-3">
              {verification.inaccuracies.length > 0 ? (
                verification.inaccuracies.map((inaccuracy: any, index: number) => (
                  <Card key={index} className="border-zinc-800 bg-zinc-950">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base text-red-500">Inaccurate Statement</CardTitle>
                      <CardDescription className="text-gray-300">
                        "{inaccuracy.statement}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                      <div className="mb-2">
                        <span className="text-gray-400">Issue: </span>
                        <span className="text-gray-300">{inaccuracy.issue}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Correction: </span>
                        <span className="text-green-300">{inaccuracy.correction}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-green-500">No inaccuracies found.</div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-yellow-500 mb-2">Outdated Information</h5>
            <div className="space-y-3">
              {verification.outdatedInformation.length > 0 ? (
                verification.outdatedInformation.map((item: any, index: number) => (
                  <Card key={index} className="border-zinc-800 bg-zinc-950">
                    <CardHeader className="py-3">
                      <CardTitle className="text-base text-yellow-500">Outdated Statement</CardTitle>
                      <CardDescription className="text-gray-300">
                        "{item.statement}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0 pb-3">
                      <div className="mb-2">
                        <span className="text-gray-400">Current Status: </span>
                        <span className="text-gray-300">{item.currentStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Reference: </span>
                        <span className="text-blue-300">{item.reference}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-green-500">No outdated information found.</div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="font-semibold text-purple-500 mb-2">Overall Assessment</h5>
            <p className="text-gray-300">{verification.overallAssessment}</p>
          </div>
        </div>
      )}
    </div>
  );
}