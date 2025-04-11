import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";
import { User as UserType } from "@shared/schema";

declare global {
  namespace Express {
    // Define User interface as the one from our schema
    interface User extends UserType {}
  }
}

export function setupAuth(app: Express) {
  // Configure session
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "cyberirag-secure-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: 'lax'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        const isValidPassword = await storage.comparePasswords(password, user.password);
        
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password." });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create the user
      const user = await storage.createUser(req.body);

      // Log in the new user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Don't send the password back
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: Error, user: UserType, info: { message: string }) => {
      if (err) return next(err);
      
      if (!user) {
        return res.status(401).json({ error: info.message || "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        
        // Don't send the password back
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    // Don't send the password back
    const { password, ...userWithoutPassword } = req.user as UserType;
    res.json(userWithoutPassword);
  });

  // Middleware to check if a user is authenticated
  const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "Authentication required" });
  };

  return { ensureAuthenticated };
}