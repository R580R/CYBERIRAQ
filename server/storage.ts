import { 
  User, InsertUser, 
  Course, InsertCourse,
  CourseSection, InsertCourseSection,
  CourseLesson, InsertCourseLesson,
  Enrollment, InsertEnrollment,
  UserCourseProgress, InsertUserCourseProgress,
  ContactMessage, InsertContactMessage,
  users, courses, courseSections, courseLessons, enrollments, 
  userCourseProgress, contactMessages,
  courseLevelEnum, courseCategoryEnum
} from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, and, desc, sql, asc } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

export interface IStorage {
  // Session store
  sessionStore: session.Store;

  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Course operations
  getAllCourses(): Promise<Course[]>;
  getFeaturedCourses(limit?: number): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getCourseById(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  incrementCourseEnrollments(id: number): Promise<Course | undefined>;

  // Course section operations
  getCourseSections(courseId: number): Promise<CourseSection[]>;
  createCourseSection(section: InsertCourseSection): Promise<CourseSection>;
  updateCourseSection(id: number, section: Partial<InsertCourseSection>): Promise<CourseSection | undefined>;
  deleteCourseSection(id: number): Promise<boolean>;

  // Course lesson operations
  getCourseLessons(sectionId: number): Promise<CourseLesson[]>;
  getLessonById(id: number): Promise<CourseLesson | undefined>;
  createCourseLesson(lesson: InsertCourseLesson): Promise<CourseLesson>;
  updateCourseLesson(id: number, lesson: Partial<InsertCourseLesson>): Promise<CourseLesson | undefined>;
  deleteCourseLesson(id: number): Promise<boolean>;

  // Enrollment operations
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  deleteEnrollment(id: number): Promise<boolean>;

  // User course progress operations
  getUserProgress(userId: number, lessonId: number): Promise<UserCourseProgress | undefined>;
  createUserProgress(progress: InsertUserCourseProgress): Promise<UserCourseProgress>;
  updateUserProgress(id: number, progress: Partial<InsertUserCourseProgress>): Promise<UserCourseProgress | undefined>;
  getUserLessonProgress(userId: number, courseId: number): Promise<UserCourseProgress[]>;

  // Contact message operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Hash password
  hashPassword(password: string): Promise<string>;
  comparePasswords(supplied: string, stored: string): Promise<boolean>;
}

// Helper utility for password hashing
const scryptAsync = promisify(scrypt);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // Password utilities
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db
      .insert(users)
      .values({
        ...user,
        password: await this.hashPassword(user.password)
      })
      .returning();
    return createdUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  // Course operations
  async getAllCourses(): Promise<Course[]> {
    return db.select().from(courses);
  }

  async getFeaturedCourses(limit = 6): Promise<Course[]> {
    return db
      .select()
      .from(courses)
      .where(eq(courses.isFeatured, true))
      .limit(limit);
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return db
      .select()
      .from(courses)
      .where(eq(courses.category, category as any));
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.slug, slug));
    return course;
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [createdCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return createdCourse;
  }

  async updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db
      .delete(courses)
      .where(eq(courses.id, id));
    
    return !!result;
  }

  async incrementCourseEnrollments(id: number): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id));
    
    if (!course) return undefined;
    
    const [updatedCourse] = await db
      .update(courses)
      .set({ 
        enrolledStudents: (course.enrolledStudents || 0) + 1, 
        updatedAt: new Date() 
      })
      .where(eq(courses.id, id))
      .returning();
    
    return updatedCourse;
  }

  // Course section operations
  async getCourseSections(courseId: number): Promise<CourseSection[]> {
    return db
      .select()
      .from(courseSections)
      .where(eq(courseSections.courseId, courseId))
      .orderBy(asc(courseSections.order));
  }

  async createCourseSection(section: InsertCourseSection): Promise<CourseSection> {
    const [createdSection] = await db
      .insert(courseSections)
      .values(section)
      .returning();
    return createdSection;
  }

  async updateCourseSection(id: number, section: Partial<InsertCourseSection>): Promise<CourseSection | undefined> {
    const [updatedSection] = await db
      .update(courseSections)
      .set(section)
      .where(eq(courseSections.id, id))
      .returning();
    
    return updatedSection;
  }

  async deleteCourseSection(id: number): Promise<boolean> {
    const result = await db
      .delete(courseSections)
      .where(eq(courseSections.id, id));
    
    return !!result;
  }

  // Course lesson operations
  async getCourseLessons(sectionId: number): Promise<CourseLesson[]> {
    return db
      .select()
      .from(courseLessons)
      .where(eq(courseLessons.sectionId, sectionId))
      .orderBy(asc(courseLessons.order));
  }

  async getLessonById(id: number): Promise<CourseLesson | undefined> {
    const [lesson] = await db
      .select()
      .from(courseLessons)
      .where(eq(courseLessons.id, id));
    return lesson;
  }

  async createCourseLesson(lesson: InsertCourseLesson): Promise<CourseLesson> {
    const [createdLesson] = await db
      .insert(courseLessons)
      .values(lesson)
      .returning();
    return createdLesson;
  }

  async updateCourseLesson(id: number, lesson: Partial<InsertCourseLesson>): Promise<CourseLesson | undefined> {
    const [updatedLesson] = await db
      .update(courseLessons)
      .set(lesson)
      .where(eq(courseLessons.id, id))
      .returning();
    
    return updatedLesson;
  }

  async deleteCourseLesson(id: number): Promise<boolean> {
    const result = await db
      .delete(courseLessons)
      .where(eq(courseLessons.id, id));
    
    return !!result;
  }

  // Enrollment operations
  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, courseId)
        )
      );
    return enrollment;
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [createdEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
    
    // Increment the course enrollment count
    await this.incrementCourseEnrollments(enrollment.courseId);
    
    return createdEnrollment;
  }

  async updateEnrollment(id: number, enrollment: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const updates: any = { ...enrollment };
    
    // If marking as completed, set the completion timestamp
    if (enrollment.isCompleted === true) {
      updates.completedAt = new Date();
    }
    
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set(updates)
      .where(eq(enrollments.id, id))
      .returning();
    
    return updatedEnrollment;
  }

  async deleteEnrollment(id: number): Promise<boolean> {
    const result = await db
      .delete(enrollments)
      .where(eq(enrollments.id, id));
    
    return !!result;
  }

  // User course progress operations
  async getUserProgress(userId: number, lessonId: number): Promise<UserCourseProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.lessonId, lessonId)
        )
      );
    return progress;
  }

  async createUserProgress(progress: InsertUserCourseProgress): Promise<UserCourseProgress> {
    const [createdProgress] = await db
      .insert(userCourseProgress)
      .values(progress)
      .returning();
    return createdProgress;
  }

  async updateUserProgress(id: number, progress: Partial<InsertUserCourseProgress>): Promise<UserCourseProgress | undefined> {
    const updates: any = { ...progress, lastAccessedAt: new Date() };
    
    // If marking as completed, set the completion timestamp
    if (progress.isCompleted === true) {
      updates.completedAt = new Date();
    }
    
    const [updatedProgress] = await db
      .update(userCourseProgress)
      .set(updates)
      .where(eq(userCourseProgress.id, id))
      .returning();
    
    return updatedProgress;
  }

  async getUserLessonProgress(userId: number, courseId: number): Promise<UserCourseProgress[]> {
    // This is more complex as we need to join with lessons to get the ones for the course
    // First, get all sections for the course
    const sections = await db
      .select()
      .from(courseSections)
      .where(eq(courseSections.courseId, courseId));
    
    if (!sections.length) return [];
    
    // Get all lesson IDs for these sections
    const sectionIds = sections.map(section => section.id);
    
    // Get all lessons for these sections
    const lessons = await db
      .select()
      .from(courseLessons)
      .where(sql`${courseLessons.sectionId} IN (${sectionIds.join(',')})`);
    
    if (!lessons.length) return [];
    
    // Get all progress records for this user and these lessons
    const lessonIds = lessons.map(lesson => lesson.id);
    
    return db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          sql`${userCourseProgress.lessonId} IN (${lessonIds.join(',')})`
        )
      );
  }

  // Contact message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    const [message] = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id));
    return message;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [createdMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return createdMessage;
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(contactMessages.id, id))
      .returning();
    
    return updatedMessage;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const result = await db
      .delete(contactMessages)
      .where(eq(contactMessages.id, id));
    
    return !!result;
  }
}

export const storage = new DatabaseStorage();
