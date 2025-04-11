import OpenAI from "openai";

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY is not set. AI features will not work properly.");
}
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Generates enhancement suggestions for course content
 * @param title Course or lesson title
 * @param content Current content to enhance
 * @param contentType Type of content (course, lesson, exercise)
 * @returns Object with suggestions for improving content
 */
export async function generateContentSuggestions(
  title: string,
  content: string,
  contentType: "course" | "lesson" | "exercise"
) {
  try {
    const promptText = `
You are an expert cybersecurity educator helping improve educational content for a platform called Cyber Iraq.
Please analyze the following ${contentType} content and provide specific suggestions for enhancement.

Title: ${title}
Content: ${content}

Provide enhancement suggestions in the following areas:
1. Technical accuracy and current relevance
2. Learning objectives clarity
3. Engagement and interactivity
4. Structure and organization
5. Security best practices alignment

Return your response as a JSON object with the following structure:
{
  "suggestions": [
    { "category": "Technical Accuracy", "issue": "...", "recommendation": "..." },
    { "category": "Learning Objectives", "issue": "...", "recommendation": "..." },
    { "category": "Engagement", "issue": "...", "recommendation": "..." },
    { "category": "Structure", "issue": "...", "recommendation": "..." },
    { "category": "Security Practices", "issue": "...", "recommendation": "..." }
  ],
  "strengths": ["strength1", "strength2", "strength3"],
  "overallRecommendation": "A brief 2-3 sentence summary of the most important improvements"
}

Ensure each suggestion is specific, actionable, and directly related to cybersecurity education.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: promptText }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(responseContent);
  } catch (error: unknown) {
    console.error("Error generating content suggestions:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate content suggestions: ${errorMessage}`);
  }
}

/**
 * Generates improvements to exercise challenges
 * @param exerciseTitle Title of the exercise
 * @param exerciseDescription Current exercise description
 * @param difficulty Current difficulty level
 * @returns Object with suggested improvements
 */
export async function enhanceExerciseChallenge(
  exerciseTitle: string,
  exerciseDescription: string,
  difficulty: "beginner" | "intermediate" | "advanced"
) {
  try {
    const promptText = `
You are a cybersecurity challenges expert helping improve exercise content for a platform called Cyber Iraq.
Please analyze the following exercise and provide specific enhancements to make it more educational and engaging.

Exercise Title: ${exerciseTitle}
Current Description: ${exerciseDescription}
Difficulty Level: ${difficulty}

Provide enhanced exercise content in the following JSON format:
{
  "enhancedDescription": "Improved, more detailed exercise description",
  "learningObjectives": ["objective1", "objective2", "objective3"],
  "hints": [
    { "level": 1, "hint": "Subtle hint for beginners" },
    { "level": 2, "hint": "More direct hint" },
    { "level": 3, "hint": "Very specific hint for those who are stuck" }
  ],
  "additionalResources": [
    { "title": "Resource Name", "description": "Brief description of how this resource helps" }
  ],
  "securityConcepts": ["concept1", "concept2", "concept3"],
  "realWorldApplication": "Brief description of how this exercise applies to real-world scenarios"
}

Ensure the enhanced content is technically accurate, engaging, and appropriate for the ${difficulty} difficulty level.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: promptText }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(responseContent);
  } catch (error: unknown) {
    console.error("Error enhancing exercise challenge:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to enhance exercise challenge: ${errorMessage}`);
  }
}

/**
 * Analyzes course structure and suggests improvements
 * @param courseTitle Course title
 * @param sections Array of section titles and descriptions
 * @returns Object with suggested improvements to course structure
 */
export async function analyzeCourseStructure(
  courseTitle: string,
  sections: Array<{ title: string; description: string }>
) {
  try {
    const sectionsText = sections.map(s => `- ${s.title}: ${s.description}`).join("\n");
    
    const promptText = `
You are a curriculum design expert helping improve a cybersecurity course for a platform called Cyber Iraq.
Please analyze the following course structure and provide specific suggestions for improvement.

Course Title: ${courseTitle}
Current Sections:
${sectionsText}

Provide course structure analysis in the following JSON format:
{
  "structuralSuggestions": [
    { "issue": "...", "recommendation": "..." }
  ],
  "gapAnalysis": [
    { "missingTopic": "Topic name", "importance": "high/medium/low", "recommendation": "Why and where this should be included" }
  ],
  "sequencingSuggestions": [
    { "currentOrder": "Section X then Section Y", "suggestedOrder": "Section Y then Section X", "justification": "..." }
  ],
  "redundancyIssues": [
    { "sections": ["Section A", "Section B"], "issue": "These sections overlap in...", "recommendation": "..." }
  ],
  "suggestedNewSections": [
    { "title": "Suggested new section title", "description": "Brief description", "rationale": "Why this section is needed" }
  ]
}

Ensure all suggestions are specific to cybersecurity education and would improve the overall learning experience.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: promptText }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(responseContent);
  } catch (error: unknown) {
    console.error("Error analyzing course structure:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to analyze course structure: ${errorMessage}`);
  }
}

/**
 * Generates technical content accuracy verification
 * @param contentText Technical content to verify
 * @param contentType Type of technical content
 * @returns Object with verification results and suggestions
 */
export async function verifyTechnicalAccuracy(
  contentText: string,
  contentType: "networking" | "cryptography" | "pentest" | "malware" | "general"
) {
  try {
    const promptText = `
You are a cybersecurity technical expert helping verify the accuracy of educational content for Cyber Iraq.
Please analyze the following ${contentType} content and verify its technical accuracy.

Content to verify: ${contentText}

Provide technical verification in the following JSON format:
{
  "accuracyScore": 0-10, // where 10 is perfectly accurate
  "inaccuracies": [
    { "statement": "The inaccurate statement", "issue": "Why it's inaccurate", "correction": "The correct information" }
  ],
  "outdatedInformation": [
    { "statement": "The outdated statement", "currentStatus": "The current state of knowledge", "reference": "Source for current information" }
  ],
  "missingCriticalInfo": [
    { "topic": "Topic with missing info", "missingElement": "What's missing", "suggestion": "What should be added" }
  ],
  "technicalErrors": [
    { "error": "Description of technical error", "impact": "Why this matters", "correction": "How to fix it" }
  ],
  "overallAssessment": "Brief 2-3 sentence technical assessment"
}

Focus only on technical accuracy, not on style or presentation. Be specific about any issues found.
    `;

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: promptText }],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for factual responses
    });

    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(responseContent);
  } catch (error: unknown) {
    console.error("Error verifying technical accuracy:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to verify technical accuracy: ${errorMessage}`);
  }
}