import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTemplateSchema, insertProposalSchema, insertActivitySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Templates API routes
  app.get("/api/templates", async (req: Request, res: Response) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const template = await storage.getTemplateById(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/templates", async (req: Request, res: Response) => {
    try {
      const result = insertTemplateSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const template = await storage.createTemplate(result.data);
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const result = insertTemplateSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const updatedTemplate = await storage.updateTemplate(id, result.data);
      if (!updatedTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid template ID" });
      }

      const success = await storage.deleteTemplate(id);
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Proposals API routes
  app.get("/api/proposals", async (req: Request, res: Response) => {
    try {
      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/recent", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const proposals = await storage.getRecentProposals(limit);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent proposals" });
    }
  });

  app.get("/api/proposals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }

      const proposal = await storage.getProposalById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      res.json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch proposal" });
    }
  });

  app.post("/api/proposals", async (req: Request, res: Response) => {
    try {
      const result = insertProposalSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const proposal = await storage.createProposal(result.data);
      
      // Create activity for the new proposal
      await storage.createActivity({
        userId: proposal.createdBy,
        action: "created",
        description: `Created a new proposal "${proposal.title}"`,
        proposalId: proposal.id
      });
      
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to create proposal" });
    }
  });

  app.put("/api/proposals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }

      const result = insertProposalSchema.partial().safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const originalProposal = await storage.getProposalById(id);
      if (!originalProposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      const updatedProposal = await storage.updateProposal(id, result.data);
      if (!updatedProposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Create activity for status change
      if (result.data.status && originalProposal.status !== result.data.status) {
        await storage.createActivity({
          userId: updatedProposal.createdBy,
          action: result.data.status,
          description: `Proposal "${updatedProposal.title}" status changed to ${result.data.status}`,
          proposalId: updatedProposal.id
        });
      }

      res.json(updatedProposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update proposal" });
    }
  });

  app.delete("/api/proposals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }

      const success = await storage.deleteProposal(id);
      if (!success) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete proposal" });
    }
  });

  app.post("/api/proposals/:id/view", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }

      const updatedProposal = await storage.incrementProposalViews(id);
      if (!updatedProposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // Create activity for the view
      await storage.createActivity({
        userId: "Client",
        action: "viewed",
        description: `${updatedProposal.clientName} viewed "${updatedProposal.title}" proposal`,
        proposalId: updatedProposal.id
      });

      res.json(updatedProposal);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment views" });
    }
  });

  // Activities API routes
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const activities = await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/recent", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const result = insertActivitySchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error).message;
        return res.status(400).json({ message: errorMessage });
      }

      const activity = await storage.createActivity(result.data);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Stats API route
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Export proposal to PDF (mock endpoint that returns success)
  app.post("/api/proposals/:id/export", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }

      const proposal = await storage.getProposalById(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      // In a real implementation, this would generate a PDF
      // For this mockup, we'll just respond with a success message
      
      // Create activity for the export
      await storage.createActivity({
        userId: proposal.createdBy,
        action: "exported",
        description: `Exported proposal "${proposal.title}" to ${req.body.format || 'PDF'}`,
        proposalId: proposal.id
      });

      res.json({ 
        success: true, 
        message: "Proposal exported successfully",
        fileName: `${proposal.title.replace(/\s+/g, '_')}.${req.body.format || 'pdf'}`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to export proposal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
