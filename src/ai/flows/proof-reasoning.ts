// ProofChain: Provide reasoning about whether the given proof of ownership/authenticity makes sense for the stated identity.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview Provides AI-driven reasoning about the validity of a proof of ownership/authenticity for a given identity.
 *
 * - proofReasoning - A function that analyzes a given proof and identity to determine if the proof is reasonable.
 * - ProofReasoningInput - The input type for the proofReasoning function.
 * - ProofReasoningOutput - The return type for the proofReasoning function.
 */

const ProofReasoningInputSchema = z.object({
  proofType: z.string().describe('Type of the proof being presented (e.g., diploma, deed, ID).'),
  proofData: z.string().describe('Data associated with the proof, such as NFT ID or document hash.'),
  identityType: z.string().describe('Type of identity being claimed (e.g., student, property owner, citizen).'),
  identityData: z.string().describe('Data associated with the identity, such as name, address, or identifying number.'),
  additionalContext: z.string().optional().describe('Additional context or information that might be relevant to the reasoning process.'),
});
export type ProofReasoningInput = z.infer<typeof ProofReasoningInputSchema>;

const ProofReasoningOutputSchema = z.object({
  reasoning: z.string().describe('AI-generated reasoning about whether the proof makes sense for the stated identity.'),
  confidenceScore: z.number().describe('A score (0-1) indicating the AI confidence in its reasoning.'),
  isValid: z.boolean().describe('A boolean value indicating whether the proof is deemed valid based on the AI reasoning.'),
});
export type ProofReasoningOutput = z.infer<typeof ProofReasoningOutputSchema>;

export async function proofReasoning(input: ProofReasoningInput): Promise<ProofReasoningOutput> {
  return proofReasoningFlow(input);
}

const proofReasoningPrompt = ai.definePrompt({
  name: 'proofReasoningPrompt',
  input: {schema: ProofReasoningInputSchema},
  output: {schema: ProofReasoningOutputSchema},
  prompt: `You are an AI assistant tasked with assessing the validity of a given proof of ownership or authenticity for a stated identity.

  Analyze the provided information and determine whether the presented proof makes sense for the claimed identity. Provide clear and concise reasoning, along with a confidence score (0-1) indicating your certainty.

  Proof Type: {{{proofType}}}
  Proof Data: {{{proofData}}}
  Identity Type: {{{identityType}}}
  Identity Data: {{{identityData}}}
  Additional Context: {{{additionalContext}}}

  Reasoning:
  Confidence Score (0-1):
  IsValid (true/false):
  `,
});

const proofReasoningFlow = ai.defineFlow(
  {
    name: 'proofReasoningFlow',
    inputSchema: ProofReasoningInputSchema,
    outputSchema: ProofReasoningOutputSchema,
  },
  async input => {
    try {
      const {output} = await proofReasoningPrompt(input);
      if (!output) {
        const err = new Error('proofReasoningPrompt returned empty output');
        console.error('Error in proofReasoningFlow:', err);
        throw err;
      }
      return output;
    } catch (error) {
      console.error('Error in proofReasoningFlow during execution:', error);
      throw error;
    }
  }
);
