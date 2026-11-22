
'use server';
/**
 * @fileOverview A Prooflight system Q&A AI agent.
 *
 * - prooflightChat - A function that handles questions about the Prooflight system.
 * - ProoflightChatInput - The input type for the prooflightChat function.
 * - ProoflightChatOutput - The return type for the prooflightChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fs from 'fs';
import path from 'path';

const KNOWLEDGE_BASE_ERROR_MESSAGE = "Error: Could not load Prooflight system information.";

// Function to read and filter the whitepaper content
function getProoflightDocumentContent(lang: 'en' | 'ar'): string {
  try {
    const filePath = path.join(process.cwd(), 'docs', 'whitepaper_draft_content.txt');
    const fullContent = fs.readFileSync(filePath, 'utf-8');
    
    const sections = [];
    const sectionSplits = fullContent.split(/---.*?---/s); 

    const targetLangSection = lang === 'ar' ? "**Arabic:**" : "**English:**";
    const otherLangSection = lang === 'ar' ? "**English:**" : "**Arabic:**";

    for (const section of sectionSplits) {
      if (section.includes(targetLangSection)) {
        const langPart = section.split(targetLangSection)[1]?.split(otherLangSection)[0];
        if (langPart) {
          sections.push(langPart.trim());
        }
      }
    }
    if (sections.length === 0) {
      console.error(`ProoflightChatFlow: No ${lang} content found in whitepaper_draft_content.txt.`);
      return KNOWLEDGE_BASE_ERROR_MESSAGE; 
    }
    return sections.join('\n\n');
  } catch (error) {
    console.error("Error reading or parsing whitepaper_draft_content.txt:", error);
    return KNOWLEDGE_BASE_ERROR_MESSAGE;
  }
}

const ProoflightChatInputSchema = z.object({
  userQuestion: z.string().describe('The user\'s question about the Prooflight system.'),
  lang: z.enum(['en', 'ar']).describe('The language of the user\'s question and desired response.'),
});
export type ProoflightChatInput = z.infer<typeof ProoflightChatInputSchema>;

const ProoflightChatOutputSchema = z.object({
  aiResponse: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type ProoflightChatOutput = z.infer<typeof ProoflightChatOutputSchema>;

export async function prooflightChat(input: ProoflightChatInput): Promise<ProoflightChatOutput> {
  return prooflightChatFlow(input);
}

const systemMessages = {
  en: `You are ProoflightBot, an AI expert on the Prooflight system.
Base your answers *only* on the provided Prooflight system document. Do not use outside knowledge.
If the question is not covered in the document, or if the document content is an error message, state that you cannot answer.
Keep answers concise and relevant. Do not invent features.
Respond in English.`,
  ar: `أنت ProoflightBot. مهمتك هي الإجابة على أسئلة المستخدم حول نظام Prooflight.
استخدم *فقط* المستند التالي كمصدر لمعلوماتك. لا تستخدم أي معرفة أخرى.
إذا كان السؤال خارج نطاق المستند، أو إذا كان المستند رسالة خطأ، فاذكر أنك لا تستطيع الإجابة.
أجب باختصار وباللغة العربية.`
};

const userQuestionLabels = {
  en: "User's Question:",
  ar: "سؤال المستخدم:"
};


const chatPromptInputSchema = ProoflightChatInputSchema.extend({
  prooflightDocumentContent: z.string(),
  systemMessageText: z.string(),
  userQuestionLabelText: z.string(),
});

const chatPrompt = ai.definePrompt({
  name: 'prooflightChatPrompt',
  input: { schema: chatPromptInputSchema },
  output: { schema: ProoflightChatOutputSchema },
  prompt: `{{{systemMessageText}}}

--- PROOFLIGHT SYSTEM DOCUMENT START ---
{{{prooflightDocumentContent}}}
--- PROOFLIGHT SYSTEM DOCUMENT END ---

{{{userQuestionLabelText}}} {{{userQuestion}}}
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const prooflightChatFlow = ai.defineFlow(
  {
    name: 'prooflightChatFlow',
    inputSchema: ProoflightChatInputSchema,
    outputSchema: ProoflightChatOutputSchema,
  },
  async (input): Promise<ProoflightChatOutput> => {
    const knowledgeBase = getProoflightDocumentContent(input.lang);
    const systemMessageText = systemMessages[input.lang];
    const userQuestionLabelText = userQuestionLabels[input.lang];

    if (knowledgeBase === KNOWLEDGE_BASE_ERROR_MESSAGE) {
      console.error("ProoflightChatFlow: Attempted to run with a missing or failed-to-load knowledge base for lang:", input.lang);
      const errorResponse = input.lang === 'ar' 
        ? "عذراً، لا يمكنني حاليًا الوصول إلى قاعدة المعرفة للإجابة على سؤالك. يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم إذا استمرت المشكلة."
        : "I'm sorry, but I'm currently unable to access my knowledge base to answer your question. Please try again later or contact support if the issue persists.";
      return { aiResponse: errorResponse };
    }

    try {
      const { output } = await chatPrompt({
        userQuestion: input.userQuestion,
        lang: input.lang,
        prooflightDocumentContent: knowledgeBase,
        systemMessageText: systemMessageText,
        userQuestionLabelText: userQuestionLabelText,
      });
      
      if (!output || typeof output.aiResponse !== 'string') {
        console.error('ProoflightChatFlow: AI response was missing or malformed.', output);
        const errorResponse = input.lang === 'ar'
          ? "لقد تلقيت ردًا، لكنه لم يكن بالتنسيق المتوقع. يرجى محاولة إعادة صياغة سؤالك أو المحاولة مرة أخرى لاحقًا."
          : "I received a response, but it wasn't in the expected format. Please try rephrasing your question or try again later.";
        return { aiResponse: errorResponse };
      }
      return output;

    } catch (flowError: any) { 
      console.error('Error in prooflightChatFlow during chatPrompt execution. Raw error:', flowError);
      if (flowError.message) {
        console.error('Error message:', flowError.message);
      }
      if (flowError.stack) {
        console.error('Error stack:', flowError.stack);
      }
      if (typeof flowError === 'object' && flowError !== null) {
           try {
            const errorDetailsToLog = {
                name: flowError.name,
                message: flowError.message,
                code: flowError.code, 
                details: flowError.details, 
                status: flowError.status 
            };
            console.error('Structured error details:', JSON.stringify(errorDetailsToLog, null, 2));
           } catch (stringifyError) {
            console.error('Could not stringify structured error details:', stringifyError);
           }
      }

      let userErrorMessage = input.lang === 'ar'
        ? "لقد واجهت مشكلة غير متوقعة أثناء محاولة الإجابة على سؤالك. يرجى المحاولة مرة أخرى."
        : "I encountered an unexpected issue while trying to answer your question. Please try again.";
      
      if (flowError.message && typeof flowError.message === 'string') {
         if (flowError.message.includes('quota')) {
            userErrorMessage = input.lang === 'ar'
              ? "يبدو أننا وصلنا إلى حد الاستخدام. يرجى المحاولة مرة أخرى لاحقًا."
              : "It seems we've hit a usage limit. Please try again later.";
         } else if (flowError.message.includes('API key')) {
            userErrorMessage = input.lang === 'ar'
              ? "قد تكون هناك مشكلة في تكوين خدمة الذكاء الاصطناعي. يرجى الاتصال بالدعم."
              : "There might be an issue with the AI service configuration. Please contact support.";
         }
      }
      return { aiResponse: userErrorMessage };
    }
  }
);

