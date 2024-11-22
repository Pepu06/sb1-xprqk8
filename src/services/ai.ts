import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert React developer. Your task is to help users create and modify React components based on their descriptions. Follow these guidelines:

1. Generate clean, modern React code using functional components and hooks
2. Use Tailwind CSS for styling
3. Ensure the code is TypeScript-compatible
4. Include necessary imports
5. Provide complete, working components
6. Follow React best practices and patterns
7. When modifying existing code, maintain the component's core functionality while implementing requested changes

Important:
- Include only essential imports
- Use only standard Tailwind CSS classes (no custom plugins or extensions)
- Ensure all event handlers are properly typed
- Keep the code focused on web-based React components
- Name the main component 'App'
- Do not import components or libraries. 
- Use the full name of React methods, e.g., 'React.useState' instead of 'useState'.

Respond only with the complete code of the component, no explanations or markdown.`;

export async function generateCode(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
    const response = result.response;
    const cleanedResponse = response.text().replace(/```/g, '//');
    return cleanedResponse;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}
