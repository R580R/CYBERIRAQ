import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List as ListIcon,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Quote,
  Table,
  Heading1,
  Heading2,
  Heading3
} from "lucide-react";

interface ProposalFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const ProposalForm = ({ form, onSubmit, isSubmitting }: ProposalFormProps) => {
  const [activeEditorTab, setActiveEditorTab] = useState("content");
  const [editorContent, setEditorContent] = useState(form.getValues().content || "");

  // Function to insert formatting into the text area
  const formatText = (format: string) => {
    const textarea = document.getElementById("proposal-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = "";

    switch (format) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${selectedText}</em>`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "h1":
        formattedText = `<h1>${selectedText}</h1>`;
        break;
      case "h2":
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case "h3":
        formattedText = `<h3>${selectedText}</h3>`;
        break;
      case "ul":
        formattedText = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
        break;
      case "ol":
        formattedText = `<ol>\n  <li>${selectedText}</li>\n</ol>`;
        break;
      case "link":
        const url = prompt("Enter URL:", "https://");
        if (url) {
          formattedText = `<a href="${url}">${selectedText || url}</a>`;
        } else {
          return;
        }
        break;
      case "image":
        const imgUrl = prompt("Enter image URL:", "https://");
        if (imgUrl) {
          formattedText = `<img src="${imgUrl}" alt="${selectedText || 'Image'}" />`;
        } else {
          return;
        }
        break;
      case "quote":
        formattedText = `<blockquote>${selectedText}</blockquote>`;
        break;
      case "table":
        formattedText = `<table>\n  <tr>\n    <th>Header 1</th>\n    <th>Header 2</th>\n  </tr>\n  <tr>\n    <td>${selectedText || 'Cell 1'}</td>\n    <td>Cell 2</td>\n  </tr>\n</table>`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    // Update both the form field and our local state
    form.setValue("content", newContent, { shouldValidate: true });
    setEditorContent(newContent);
    
    // Set focus back to textarea
    textarea.focus();
    
    // Try to set the cursor position after the inserted text
    setTimeout(() => {
      const newCursorPosition = start + formattedText.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
    form.setValue("content", e.target.value, { shouldValidate: true });
  };

  // Function to add a section template
  const addSection = (sectionType: string) => {
    let sectionTemplate = "";
    const currentContent = form.getValues().content || "";

    switch (sectionType) {
      case "executive-summary":
        sectionTemplate = `<h2>Executive Summary</h2>
<p>This section provides a high-level overview of the proposal and outlines the key benefits and value proposition for the client.</p>`;
        break;
      case "about-us":
        sectionTemplate = `<h2>About Our Company</h2>
<p>This section introduces your company, expertise, and relevant experience that positions you as the ideal partner for this project.</p>`;
        break;
      case "problem-statement":
        sectionTemplate = `<h2>Problem Statement</h2>
<p>This section articulates the client's current challenges and pain points that your proposal aims to address.</p>`;
        break;
      case "proposed-solution":
        sectionTemplate = `<h2>Proposed Solution</h2>
<p>This section outlines your recommended approach, methodology, and deliverables to solve the client's challenges.</p>`;
        break;
      case "timeline":
        sectionTemplate = `<h2>Project Timeline</h2>
<p>This section presents the project schedule, key milestones, and delivery dates for the proposed work.</p>
<table>
  <tr>
    <th>Phase</th>
    <th>Deliverable</th>
    <th>Timeline</th>
  </tr>
  <tr>
    <td>Phase 1</td>
    <td>Initial Deliverable</td>
    <td>Week 1-2</td>
  </tr>
  <tr>
    <td>Phase 2</td>
    <td>Secondary Deliverable</td>
    <td>Week 3-4</td>
  </tr>
  <tr>
    <td>Phase 3</td>
    <td>Final Deliverable</td>
    <td>Week 5-6</td>
  </tr>
</table>`;
        break;
      case "pricing":
        sectionTemplate = `<h2>Investment</h2>
<p>This section details the pricing structure, payment terms, and any additional costs associated with the proposal.</p>
<table>
  <tr>
    <th>Service</th>
    <th>Description</th>
    <th>Price</th>
  </tr>
  <tr>
    <td>Service 1</td>
    <td>Description of service 1</td>
    <td>$X,XXX</td>
  </tr>
  <tr>
    <td>Service 2</td>
    <td>Description of service 2</td>
    <td>$X,XXX</td>
  </tr>
  <tr>
    <td>Total</td>
    <td></td>
    <td>$XX,XXX</td>
  </tr>
</table>`;
        break;
      case "team":
        sectionTemplate = `<h2>Our Team</h2>
<p>This section introduces the key team members who will be working on the project and their qualifications.</p>`;
        break;
      case "case-studies":
        sectionTemplate = `<h2>Case Studies & Success Stories</h2>
<p>This section showcases relevant success stories and past client work that demonstrates your expertise.</p>`;
        break;
      case "next-steps":
        sectionTemplate = `<h2>Next Steps</h2>
<p>This section outlines the immediate next steps to proceed with the proposal and get the project started.</p>
<ul>
  <li>Review and sign the proposal</li>
  <li>Initial kickoff meeting</li>
  <li>Project planning and setup</li>
</ul>`;
        break;
      default:
        sectionTemplate = "";
    }

    // Add a line break if there's already content
    const newContent = currentContent 
      ? currentContent + "\n\n" + sectionTemplate 
      : sectionTemplate;
    
    form.setValue("content", newContent, { shouldValidate: true });
    setEditorContent(newContent);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Marketing Strategy Proposal" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your proposal a descriptive title
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormDescription>
                      Name of the client or company
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Label htmlFor="proposal-content" className="text-base font-medium mb-2 block">Proposal Content</Label>
            
            <div className="border rounded-lg">
              {/* Editor Toolbar */}
              <div className="bg-neutral-50 border-b p-2 flex flex-wrap gap-1 editor-toolbar">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("underline")}
                >
                  <Underline className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="mx-1 h-6" />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("h1")}
                >
                  <Heading1 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("h2")}
                >
                  <Heading2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("h3")}
                >
                  <Heading3 className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="mx-1 h-6" />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("ul")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("ol")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="mx-1 h-6" />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("link")}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("image")}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("quote")}
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button" 
                  onClick={() => formatText("table")}
                >
                  <Table className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Editor and Sections Tabs */}
              <Tabs value={activeEditorTab} onValueChange={setActiveEditorTab}>
                <TabsList className="w-full justify-start rounded-none border-b">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="sections">Add Sections</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="p-0 m-0">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            id="proposal-content"
                            placeholder="Enter your proposal content here..."
                            className="min-h-[300px] rounded-none rounded-b-lg resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={editorContent}
                            onChange={handleContentChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="sections" className="p-4 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("executive-summary")}
                    >
                      Executive Summary
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("about-us")}
                    >
                      About Us
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("problem-statement")}
                    >
                      Problem Statement
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("proposed-solution")}
                    >
                      Proposed Solution
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("timeline")}
                    >
                      Timeline
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("pricing")}
                    >
                      Pricing / Investment
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("team")}
                    >
                      Our Team
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("case-studies")}
                    >
                      Case Studies
                    </Button>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="justify-start"
                      onClick={() => addSection("next-steps")}
                    >
                      Next Steps
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">&#8203;</span>
                Saving...
              </>
            ) : "Save Proposal"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProposalForm;
