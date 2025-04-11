import { Proposal } from "@shared/schema";

// Mock implementation of PDF export functionality
// In a real application, this would use a library like jsPDF or react-to-pdf
export const exportToPdf = (proposal: Proposal) => {
  console.log("Exporting proposal to PDF:", proposal.title);
  
  // In a real implementation, we would generate a PDF and download it
  // For this demo, we'll create a simple HTML representation and open it in a new tab
  
  try {
    // Parse the content JSON if needed
    let content = proposal.content;
    try {
      if (typeof content === "string" && content.startsWith("{")) {
        const parsedContent = JSON.parse(content);
        if (parsedContent.sections) {
          content = parsedContent.sections.map((section: any) => 
            `<div class="section">
              <h2>${section.title}</h2>
              <div>${section.content}</div>
            </div>`
          ).join('');
        }
      }
    } catch (e) {
      // If parsing fails, use content as is
      console.error("Failed to parse proposal content:", e);
    }

    // Create a new window with the proposal content
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      throw new Error("Couldn't open a new window for PDF preview. Please check your popup blocker settings.");
    }

    // Create HTML content for the new window
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${proposal.title} - PDF Export</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #ddd;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
            }
            .client {
              font-weight: bold;
              margin-top: 10px;
            }
            .content {
              margin-bottom: 30px;
            }
            .section h2 {
              margin-top: 20px;
              padding-bottom: 5px;
              border-bottom: 1px solid #eee;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="background: #f5f5f5; padding: 10px; margin-bottom: 20px; text-align: center;">
            <p>This is a preview of your PDF export. Use your browser's print function to save as PDF.</p>
            <button onclick="window.print()" style="padding: 8px 16px; background: #0F62FE; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print / Save as PDF
            </button>
          </div>
          
          <div class="header">
            <div class="title">${proposal.title}</div>
            <div class="subtitle">Business Proposal</div>
            <div class="client">Prepared for: ${proposal.clientName}</div>
            <div class="subtitle">Prepared by: ${proposal.createdBy}</div>
            <div class="subtitle">Date: ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="content">
            ${content}
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} ProposalPro. All rights reserved.</p>
            <p>This proposal is confidential and intended only for the recipient named above.</p>
          </div>
        </body>
      </html>
    `);

    newWindow.document.close();
    
    return true;
  } catch (error) {
    console.error("Failed to export PDF:", error);
    return false;
  }
};

// Function to export to Word (mock)
export const exportToWord = (proposal: Proposal) => {
  console.log("Exporting proposal to Word:", proposal.title);
  // This would typically use a library like docx.js
  // For now, we'll just return a mock success
  return true;
};

export default {
  exportToPdf,
  exportToWord
};
