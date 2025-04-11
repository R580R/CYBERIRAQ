import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import sgMail from "@sendgrid/mail";
import {
  insertCourseSchema,
  insertCourseSectionSchema,
  insertCourseLessonSchema,
  insertUserSchema,
  insertEnrollmentSchema,
  insertUserCourseProgressSchema,
  insertContactMessageSchema,
} from "@shared/schema";
import { z } from "zod";
import {
  generateContentSuggestions,
  enhanceExerciseChallenge,
  analyzeCourseStructure,
  verifyTechnicalAccuracy
} from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  const { ensureAuthenticated, ensureAdmin } = setupAuth(app);

  // SendGrid setup
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log("SendGrid API key configured correctly");
  } else {
    console.warn("SendGrid API key is not set or doesn't start with 'SG.'. Email features will not work properly.");
  }

  // ===== Courses =====
  app.get("/api/courses", async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const courses = await storage.getFeaturedCourses(limit);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching featured courses:", error);
      res.status(500).json({ error: "Failed to fetch featured courses" });
    }
  });

  app.get("/api/courses/category/:category", async (req: Request, res: Response) => {
    try {
      const courses = await storage.getCoursesByCategory(req.params.category);
      res.json(courses);
    } catch (error) {
      console.error(`Error fetching courses for category ${req.params.category}:`, error);
      res.status(500).json({ error: "Failed to fetch courses by category" });
    }
  });

  app.get("/api/courses/:slug", async (req: Request, res: Response) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error(`Error fetching course with slug ${req.params.slug}:`, error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  app.post("/api/courses", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ error: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id, 10);
      const course = await storage.updateCourse(courseId, req.body);
      
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error(`Error updating course ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id, 10);
      const result = await storage.deleteCourse(courseId);
      
      if (!result) {
        return res.status(404).json({ error: "Course not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error deleting course ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete course" });
    }
  });

  // ===== Course Sections =====
  app.get("/api/courses/:courseId/sections", async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId, 10);
      const sections = await storage.getCourseSections(courseId);
      res.json(sections);
    } catch (error) {
      console.error(`Error fetching sections for course ${req.params.courseId}:`, error);
      res.status(500).json({ error: "Failed to fetch course sections" });
    }
  });

  app.post("/api/courses/:courseId/sections", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId, 10);
      const validatedData = insertCourseSectionSchema.parse({
        ...req.body,
        courseId
      });
      
      const section = await storage.createCourseSection(validatedData);
      res.status(201).json(section);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error creating section for course ${req.params.courseId}:`, error);
      res.status(500).json({ error: "Failed to create course section" });
    }
  });

  app.put("/api/sections/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const sectionId = parseInt(req.params.id, 10);
      const section = await storage.updateCourseSection(sectionId, req.body);
      
      if (!section) {
        return res.status(404).json({ error: "Section not found" });
      }
      
      res.json(section);
    } catch (error) {
      console.error(`Error updating section ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update section" });
    }
  });

  app.delete("/api/sections/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const sectionId = parseInt(req.params.id, 10);
      const result = await storage.deleteCourseSection(sectionId);
      
      if (!result) {
        return res.status(404).json({ error: "Section not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error deleting section ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete section" });
    }
  });

  // ===== Course Lessons =====
  app.get("/api/sections/:sectionId/lessons", async (req: Request, res: Response) => {
    try {
      const sectionId = parseInt(req.params.sectionId, 10);
      const lessons = await storage.getCourseLessons(sectionId);
      res.json(lessons);
    } catch (error) {
      console.error(`Error fetching lessons for section ${req.params.sectionId}:`, error);
      res.status(500).json({ error: "Failed to fetch section lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id, 10);
      const lesson = await storage.getLessonById(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error(`Error fetching lesson ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch lesson" });
    }
  });

  app.post("/api/sections/:sectionId/lessons", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const sectionId = parseInt(req.params.sectionId, 10);
      const validatedData = insertCourseLessonSchema.parse({
        ...req.body,
        sectionId
      });
      
      const lesson = await storage.createCourseLesson(validatedData);
      res.status(201).json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error creating lesson for section ${req.params.sectionId}:`, error);
      res.status(500).json({ error: "Failed to create lesson" });
    }
  });

  app.put("/api/lessons/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id, 10);
      const lesson = await storage.updateCourseLesson(lessonId, req.body);
      
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error(`Error updating lesson ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update lesson" });
    }
  });

  app.delete("/api/lessons/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id, 10);
      const result = await storage.deleteCourseLesson(lessonId);
      
      if (!result) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error deleting lesson ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete lesson" });
    }
  });

  // ===== Enrollments =====
  app.get("/api/user/enrollments", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/courses/:courseId/enroll", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId, 10);
      const userId = (req.user as any).id;
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ error: "Already enrolled in this course" });
      }
      
      const validatedData = insertEnrollmentSchema.parse({
        userId,
        courseId,
        isCompleted: false
      });
      
      const enrollment = await storage.createEnrollment(validatedData);
      res.status(201).json(enrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error enrolling in course ${req.params.courseId}:`, error);
      res.status(500).json({ error: "Failed to enroll in course" });
    }
  });

  app.put("/api/enrollments/:id", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const enrollmentId = parseInt(req.params.id, 10);
      const enrollment = await storage.updateEnrollment(enrollmentId, req.body);
      
      if (!enrollment) {
        return res.status(404).json({ error: "Enrollment not found" });
      }
      
      res.json(enrollment);
    } catch (error) {
      console.error(`Error updating enrollment ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update enrollment" });
    }
  });

  // ===== Course Progress =====
  app.get("/api/progress/:lessonId", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId, 10);
      const userId = (req.user as any).id;
      
      const progress = await storage.getUserProgress(userId, lessonId);
      res.json(progress || { isCompleted: false });
    } catch (error) {
      console.error(`Error fetching progress for lesson ${req.params.lessonId}:`, error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress/:lessonId", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId, 10);
      const userId = (req.user as any).id;
      
      // Check if progress already exists
      let progress = await storage.getUserProgress(userId, lessonId);
      
      if (progress) {
        // Update existing progress
        progress = await storage.updateUserProgress(progress.id, {
          isCompleted: req.body.isCompleted
        });
      } else {
        // Create new progress
        const validatedData = insertUserCourseProgressSchema.parse({
          userId,
          lessonId,
          isCompleted: req.body.isCompleted
        });
        
        progress = await storage.createUserProgress(validatedData);
      }
      
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error(`Error updating progress for lesson ${req.params.lessonId}:`, error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/courses/:courseId/progress", ensureAuthenticated, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId, 10);
      const userId = (req.user as any).id;
      
      const progress = await storage.getUserLessonProgress(userId, courseId);
      res.json(progress);
    } catch (error) {
      console.error(`Error fetching progress for course ${req.params.courseId}:`, error);
      res.status(500).json({ error: "Failed to fetch course progress" });
    }
  });

  // ===== Contact Form =====
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // Send email notification
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: 'asaerf0001@gmail.com',
          from: 'noreply@cyberiraq.com',
          subject: 'New Contact Form Submission',
          text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nPhone: ${validatedData.phone || 'Not provided'}\n\nMessage: ${validatedData.message}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Phone:</strong> ${validatedData.phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          `,
        };
        
        try {
          await sgMail.send(msg);
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Continue with the response even if email fails
        }
      }
      
      res.status(201).json({ success: true, messageId: message.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error processing contact message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Admin only - contact message management
  app.get("/api/admin/contact-messages", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.put("/api/admin/contact-messages/:id/read", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.id, 10);
      const message = await storage.markContactMessageAsRead(messageId);
      
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      console.error(`Error marking message ${req.params.id} as read:`, error);
      res.status(500).json({ error: "Failed to update message" });
    }
  });
  
  // Admin only - delete contact message
  app.delete("/api/admin/contact-messages/:id", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.id, 10);
      const result = await storage.deleteContactMessage(messageId);
      
      if (!result) {
        return res.status(404).json({ error: "Message not found" });
      }
      
      res.sendStatus(204);
    } catch (error) {
      console.error(`Error deleting message ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // ===== AI-Powered Content Enhancement =====

  // Generate content suggestions for courses, lessons, or exercises
  app.post("/api/ai/content-suggestions", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const { title, content, contentType } = req.body;
      
      if (!title || !content || !contentType) {
        return res.status(400).json({ error: "Title, content, and contentType are required" });
      }
      
      if (!["course", "lesson", "exercise"].includes(contentType)) {
        return res.status(400).json({ error: "contentType must be one of: course, lesson, exercise" });
      }
      
      const suggestions = await generateContentSuggestions(
        title, 
        content, 
        contentType as "course" | "lesson" | "exercise"
      );
      
      res.json(suggestions);
    } catch (error) {
      console.error("Error generating content suggestions:", error);
      res.status(500).json({ 
        error: "Failed to generate content suggestions",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Enhance exercise challenge
  app.post("/api/ai/enhance-exercise", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const { title, description, difficulty } = req.body;
      
      if (!title || !description || !difficulty) {
        return res.status(400).json({ error: "Title, description, and difficulty are required" });
      }
      
      if (!["beginner", "intermediate", "advanced"].includes(difficulty)) {
        return res.status(400).json({ error: "difficulty must be one of: beginner, intermediate, advanced" });
      }
      
      const enhancedExercise = await enhanceExerciseChallenge(
        title, 
        description, 
        difficulty as "beginner" | "intermediate" | "advanced"
      );
      
      res.json(enhancedExercise);
    } catch (error) {
      console.error("Error enhancing exercise:", error);
      res.status(500).json({ 
        error: "Failed to enhance exercise challenge",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Analyze course structure
  app.post("/api/ai/analyze-course-structure", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const { title, sections } = req.body;
      
      if (!title || !Array.isArray(sections) || sections.length === 0) {
        return res.status(400).json({ error: "Title and sections array are required" });
      }
      
      for (const section of sections) {
        if (!section.title || !section.description) {
          return res.status(400).json({ error: "Each section must have a title and description" });
        }
      }
      
      const analysis = await analyzeCourseStructure(title, sections);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing course structure:", error);
      res.status(500).json({ 
        error: "Failed to analyze course structure",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Verify technical accuracy
  app.post("/api/ai/verify-accuracy", ensureAdmin, async (req: Request, res: Response) => {
    try {
      const { content, contentType } = req.body;
      
      if (!content || !contentType) {
        return res.status(400).json({ error: "Content and contentType are required" });
      }
      
      if (!["networking", "cryptography", "pentest", "malware", "general"].includes(contentType)) {
        return res.status(400).json({ 
          error: "contentType must be one of: networking, cryptography, pentest, malware, general" 
        });
      }
      
      const verification = await verifyTechnicalAccuracy(
        content, 
        contentType as "networking" | "cryptography" | "pentest" | "malware" | "general"
      );
      
      res.json(verification);
    } catch (error) {
      console.error("Error verifying technical accuracy:", error);
      res.status(500).json({ 
        error: "Failed to verify technical accuracy",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
