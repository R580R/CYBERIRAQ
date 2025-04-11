import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Template, Proposal, insertProposalSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Eye, 
  Download, 
  Copy, 
  Trash, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List,
  ListOrdered,
  Link as LinkIcon
} from "lucide-react";
import { exportToPdf } from "@/lib/pdf-export";
import ProposalForm from "@/components/proposals/ProposalForm";

const ProposalEditor = () => {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("edit");
  const [template, setTemplate] = useState<Template | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Depending on the route, we're either creating a new proposal or editing an existing one
  const isNewProposal = !id || window.location.pathname.includes("/proposals/new");
  const isFromTemplate = window.location.pathname.includes("/templates/") && id;

  // Fetch template if coming from a template
  const { data: templateData, isLoading: isTemplateLoading } = useQuery<Template>({
    queryKey: [`/api/templates/${id}`],
    enabled: isFromTemplate,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch template",
        variant: "destructive",
      });
    }
  });

  // Fetch proposal if editing
  const { data: proposalData, isLoading: isProposalLoading } = useQuery<Proposal>({
    queryKey: [`/api/proposals/${id}`],
    enabled: !isNewProposal && !isFromTemplate,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch proposal",
        variant: "destructive",
      });
    }
  });

  // Extended validation schema
  const formSchema = insertProposalSchema.extend({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(10, "Content is required"),
    clientName: z.string().min(2, "Client name is required"),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      createdBy: "John Doe", // Default to current user
      clientName: "",
      status: "draft",
      templateId: isFromTemplate ? Number(id) : undefined
    }
  });

  // Set up template or proposal data when it loads
  useEffect(() => {
    if (templateData && isFromTemplate) {
      setTemplate(templateData);
      
      // Pre-fill form with template content
      form.reset({
        title: "",
        content: templateData.content,
        createdBy: "John Doe",
        clientName: "",
        status: "draft",
        templateId: templateData.id
      });
    }
    
    if (proposalData && !isNewProposal && !isFromTemplate) {
      setProposal(proposalData);
      
      // Pre-fill form with proposal data
      form.reset({
        title: proposalData.title,
        content: proposalData.content,
        createdBy: proposalData.createdBy,
        clientName: proposalData.clientName,
        status: proposalData.status,
        templateId: proposalData.templateId
      });
    }
  }, [templateData, proposalData, isFromTemplate, isNewProposal, form]);

  // Save proposal mutation
  const saveProposal = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isNewProposal || isFromTemplate) {
        return apiRequest("POST", "/api/proposals", data);
      } else {
        return apiRequest("PUT", `/api/proposals/${id}`, data);
      }
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setProposal(data);
      
      toast({
        title: "Success",
        description: isNewProposal 
          ? "Proposal created successfully" 
          : "Proposal updated successfully",
      });
      
      // Redirect to proposals page if it's a new proposal
      if (isNewProposal || isFromTemplate) {
        setLocation(`/proposals/${data.id}`);
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals/recent'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: isNewProposal 
          ? "Failed to create proposal" 
          : "Failed to update proposal",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Send proposal mutation
  const sendProposal = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", `/api/proposals/${id || proposal?.id}`, {
        status: "sent"
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setProposal(data);
      
      toast({
        title: "Success",
        description: "Proposal sent successfully",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals/recent'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send proposal",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Delete proposal mutation
  const deleteProposal = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/proposals/${id || proposal?.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Proposal deleted successfully",
      });
      
      // Redirect to proposals page
      setLocation("/proposals");
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals/recent'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete proposal",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Export proposal mutation
  const exportProposal = useMutation({
    mutationFn: async (format: string) => {
      return apiRequest("POST", `/api/proposals/${id || proposal?.id}/export`, { format });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      
      toast({
        title: "Success",
        description: `Proposal exported as ${data.fileName}`,
      });
      
      // In a real implementation, we would download the file here
      // For this demo, we'll use our client-side PDF generation
      if (proposal) {
        exportToPdf(proposal);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to export proposal",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  // Submit handler
  const onSubmit = (data: FormValues) => {
    saveProposal.mutate(data);
  };

  // Loading state
  if ((!isNewProposal && isProposalLoading) || (isFromTemplate && isTemplateLoading)) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {isNewProposal ? "Create Proposal" : `Edit: ${proposal?.title || ""}`}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                {isFromTemplate 
                  ? `Using template: ${template?.name}` 
                  : isNewProposal 
                    ? "Create a new business proposal" 
                    : "Edit your business proposal"}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            {!isNewProposal && (
              <>
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => exportProposal.mutate("pdf")}
                  disabled={exportProposal.isPending}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex items-center"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this proposal?")) {
                      deleteProposal.mutate();
                    }
                  }}
                  disabled={deleteProposal.isPending}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            <Button 
              variant="secondary" 
              className="flex items-center"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={saveProposal.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            {(!isNewProposal && proposal?.status === "draft") && (
              <Button 
                className="flex items-center"
                onClick={() => sendProposal.mutate()}
                disabled={sendProposal.isPending}
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="edit" className="mt-4">
          <ProposalForm 
            form={form} 
            onSubmit={onSubmit}
            isSubmitting={saveProposal.isPending}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{form.watch("title") || "Untitled Proposal"}</CardTitle>
              <div className="flex text-sm text-neutral-500">
                <span>Created by {form.watch("createdBy")}</span>
                <span className="mx-2">•</span>
                <span>For {form.watch("clientName") || "Client"}</span>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: form.watch("content") }} />
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <div className="text-sm text-neutral-500">
                Status: <span className="capitalize">{form.watch("status")}</span>
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  onClick={() => exportProposal.mutate("pdf")}
                  disabled={exportProposal.isPending}
                >
                  <Download className="mr-2 h-3 w-3" />
                  Export
                </Button>
                <Button size="sm" className="flex items-center">
                  <Eye className="mr-2 h-3 w-3" />
                  View as Client
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalEditor;
