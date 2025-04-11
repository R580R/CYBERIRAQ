import { 
  User, InsertUser, 
  Template, InsertTemplate, 
  Proposal, InsertProposal,
  Activity, InsertActivity,
  Stats, InsertStats,
  users, templates, proposals, activities, stats
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Template operations
  getAllTemplates(): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: number, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;

  // Proposal operations
  getAllProposals(): Promise<Proposal[]>;
  getProposalById(id: number): Promise<Proposal | undefined>;
  getRecentProposals(limit: number): Promise<Proposal[]>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined>;
  deleteProposal(id: number): Promise<boolean>;
  incrementProposalViews(id: number): Promise<Proposal | undefined>;

  // Activity operations
  getAllActivities(): Promise<Activity[]>;
  getRecentActivities(limit: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Stats operations
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: Partial<InsertStats>): Promise<Stats | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, Template>;
  private proposals: Map<number, Proposal>;
  private activities: Map<number, Activity>;
  private stats: Stats | undefined;
  private currentUserId: number;
  private currentTemplateId: number;
  private currentProposalId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.proposals = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentTemplateId = 1;
    this.currentProposalId = 1;
    this.currentActivityId = 1;

    // Initialize with some demo templates
    this.initializeTemplates();
    // Initialize with demo stats
    this.initializeStats();
  }

  // Initialize some templates for demo purposes
  private initializeTemplates() {
    const demoTemplates: InsertTemplate[] = [
      {
        name: "Digital Marketing Proposal",
        description: "Perfect for agencies offering digital marketing services",
        content: JSON.stringify({
          sections: [
            { title: "Executive Summary", content: "Overview of our digital marketing approach." },
            { title: "Scope of Work", content: "Detailed breakdown of services included." },
            { title: "Timeline", content: "Project milestones and deadlines." },
            { title: "Investment", content: "Pricing and payment terms." },
            { title: "Next Steps", content: "How to proceed with the proposal." }
          ]
        }),
        imageUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        isPopular: true,
        isNew: false,
        category: "Marketing"
      },
      {
        name: "Business Consulting",
        description: "Comprehensive template for consulting services",
        content: JSON.stringify({
          sections: [
            { title: "Executive Summary", content: "Overview of our consulting approach." },
            { title: "Problem Statement", content: "Analysis of current challenges." },
            { title: "Proposed Solution", content: "Our recommended approach." },
            { title: "Methodology", content: "How we'll implement the solution." },
            { title: "Timeline & Deliverables", content: "Project schedule." },
            { title: "Investment", content: "Pricing and payment terms." }
          ]
        }),
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        isPopular: false,
        isNew: true,
        category: "Consulting"
      },
      {
        name: "Web Development",
        description: "Detailed proposal for web development projects",
        content: JSON.stringify({
          sections: [
            { title: "Project Overview", content: "Summary of the web development project." },
            { title: "Technical Approach", content: "Technologies and methods we'll use." },
            { title: "Development Phases", content: "Step-by-step project plan." },
            { title: "Testing & Quality Assurance", content: "Our QA process." },
            { title: "Hosting & Maintenance", content: "Post-launch support details." },
            { title: "Investment", content: "Pricing breakdown and payment schedule." }
          ]
        }),
        imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        isPopular: false,
        isNew: false,
        category: "Development"
      }
    ];

    demoTemplates.forEach(template => this.createTemplate(template));

    // Create some demo proposals
    const demoProposals: InsertProposal[] = [
      {
        title: "Digital Marketing Strategy - Acme Inc.",
        content: JSON.stringify({
          sections: [
            { title: "Executive Summary", content: "Digital marketing strategy for Acme Inc." },
            { title: "Scope of Work", content: "SEO, SEM, Social Media, Email Marketing" },
            { title: "Timeline", content: "6-month project with monthly deliverables" },
            { title: "Investment", content: "$5,000 per month" }
          ]
        }),
        createdBy: "Jane Smith",
        clientName: "Acme Inc.",
        status: "sent",
        templateId: 1
      },
      {
        title: "Website Redesign - TechCorp",
        content: JSON.stringify({
          sections: [
            { title: "Project Overview", content: "Complete redesign of TechCorp website" },
            { title: "Technical Approach", content: "Modern tech stack with React and Node.js" },
            { title: "Development Phases", content: "Design, Development, Testing, Launch" },
            { title: "Investment", content: "$15,000 total project" }
          ]
        }),
        createdBy: "Robert Johnson",
        clientName: "TechCorp",
        status: "draft",
        templateId: 3
      },
      {
        title: "Content Marketing - GloboTech",
        content: JSON.stringify({
          sections: [
            { title: "Executive Summary", content: "Content strategy for GloboTech" },
            { title: "Content Calendar", content: "12-month content plan" },
            { title: "Distribution Strategy", content: "Multi-channel approach" },
            { title: "Investment", content: "$3,000 per month" }
          ]
        }),
        createdBy: "Michael Brown",
        clientName: "GloboTech",
        status: "accepted",
        templateId: 1
      },
      {
        title: "SEO Audit - LeadGen Co.",
        content: JSON.stringify({
          sections: [
            { title: "Audit Overview", content: "Comprehensive SEO audit" },
            { title: "Findings", content: "Current issues and opportunities" },
            { title: "Recommendations", content: "Action items in priority order" },
            { title: "Implementation Plan", content: "3-month roadmap" },
            { title: "Investment", content: "$2,500 one-time fee" }
          ]
        }),
        createdBy: "Sarah Williams",
        clientName: "LeadGen Co.",
        status: "declined",
        templateId: 1
      }
    ];

    demoProposals.forEach(proposal => this.createProposal(proposal));

    // Create some demo activities
    const demoActivities: InsertActivity[] = [
      {
        userId: "Robert Johnson",
        action: "sent",
        description: "Sent proposal \"Website Redesign\" to TechCorp",
        proposalId: 2
      },
      {
        userId: "Jane Smith",
        action: "accepted",
        description: "Proposal \"Content Marketing\" was accepted by GloboTech",
        proposalId: 3
      },
      {
        userId: "Michael Brown",
        action: "created",
        description: "Created a new proposal \"SEO Strategy\" from template",
        proposalId: 4
      },
      {
        userId: "Client",
        action: "viewed",
        description: "Acme Inc. viewed \"Digital Marketing Strategy\" proposal",
        proposalId: 1
      }
    ];

    demoActivities.forEach(activity => this.createActivity(activity));
  }

  // Initialize stats
  private initializeStats() {
    this.stats = {
      id: 1,
      totalProposals: 24,
      acceptedProposals: 18,
      proposalViews: 143,
      pendingApprovals: 6,
      lastUpdated: new Date()
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Template operations
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const newTemplate: Template = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: number, templateUpdate: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate: Template = { ...template, ...templateUpdate };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Proposal operations
  async getAllProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values());
  }

  async getProposalById(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async getRecentProposals(limit: number): Promise<Proposal[]> {
    return Array.from(this.proposals.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit);
  }

  async createProposal(proposal: InsertProposal): Promise<Proposal> {
    const id = this.currentProposalId++;
    const now = new Date();
    const newProposal: Proposal = {
      ...proposal,
      id,
      views: 0,
      createdAt: now,
      updatedAt: now
    };
    this.proposals.set(id, newProposal);
    
    // Update stats
    if (this.stats) {
      this.updateStats({ totalProposals: this.stats.totalProposals + 1 });
      if (proposal.status === "accepted") {
        this.updateStats({ acceptedProposals: this.stats.acceptedProposals + 1 });
      }
    }
    
    return newProposal;
  }

  async updateProposal(id: number, proposalUpdate: Partial<InsertProposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    
    const now = new Date();
    const updatedProposal: Proposal = {
      ...proposal,
      ...proposalUpdate,
      updatedAt: now
    };
    this.proposals.set(id, updatedProposal);
    
    // Update stats if status changed
    if (proposalUpdate.status && proposal.status !== proposalUpdate.status && this.stats) {
      if (proposalUpdate.status === "accepted") {
        this.updateStats({ acceptedProposals: this.stats.acceptedProposals + 1 });
      }
      if (proposal.status === "accepted" && proposalUpdate.status !== "accepted") {
        this.updateStats({ acceptedProposals: Math.max(0, this.stats.acceptedProposals - 1) });
      }
    }
    
    return updatedProposal;
  }

  async deleteProposal(id: number): Promise<boolean> {
    const proposal = this.proposals.get(id);
    if (!proposal) return false;
    
    const result = this.proposals.delete(id);
    
    // Update stats
    if (result && this.stats) {
      this.updateStats({ totalProposals: Math.max(0, this.stats.totalProposals - 1) });
      if (proposal.status === "accepted") {
        this.updateStats({ acceptedProposals: Math.max(0, this.stats.acceptedProposals - 1) });
      }
    }
    
    return result;
  }

  async incrementProposalViews(id: number): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    
    const updatedProposal: Proposal = {
      ...proposal,
      views: proposal.views + 1,
      updatedAt: new Date()
    };
    this.proposals.set(id, updatedProposal);
    
    // Update stats
    if (this.stats) {
      this.updateStats({ proposalViews: this.stats.proposalViews + 1 });
    }
    
    return updatedProposal;
  }

  // Activity operations
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getRecentActivities(limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = {
      ...activity,
      id,
      timestamp: new Date()
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Stats operations
  async getStats(): Promise<Stats | undefined> {
    return this.stats;
  }

  async updateStats(statsUpdate: Partial<InsertStats>): Promise<Stats | undefined> {
    if (!this.stats) return undefined;
    
    this.stats = {
      ...this.stats,
      ...statsUpdate,
      lastUpdated: new Date()
    };
    
    return this.stats;
  }
}

export const storage = new MemStorage();
