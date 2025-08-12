'use server';

/**
 * @fileOverview A service description generator AI agent.
 *
 * - generateServiceDescription - A function that generates a service description.
 * - GenerateServiceDescriptionInput - The input type for the generateServiceDescription function.
 * - GenerateServiceDescriptionOutput - The return type for the generateServiceDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateServiceDescriptionInputSchema = z.object({
  serviceName: z.string().describe('The name of the service.'),
  activityType: z.string().describe('The type of activity the service relates to.'),
  targetAudience: z.string().describe('The target audience for the service.'),
  keyFeatures: z.string().describe('Key features or benefits of the service.'),
});
export type GenerateServiceDescriptionInput = z.infer<typeof GenerateServiceDescriptionInputSchema>;

const GenerateServiceDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging description of the service.'),
});
export type GenerateServiceDescriptionOutput = z.infer<typeof GenerateServiceDescriptionOutputSchema>;

export async function generateServiceDescription(input: GenerateServiceDescriptionInput): Promise<GenerateServiceDescriptionOutput> {
  return generateServiceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: {schema: GenerateServiceDescriptionInputSchema},
  output: {schema: GenerateServiceDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter for a sports and recreation club.

  Your task is to generate an engaging and informative description for a service offered by the club.

  Use the following information to create the description:

  Service Name: {{{serviceName}}}
  Activity Type: {{{activityType}}}
  Target Audience: {{{targetAudience}}}
  Key Features: {{{keyFeatures}}}

  The description should highlight the benefits of the service and appeal to the target audience. Keep it concise and easy to read.
  `,
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: GenerateServiceDescriptionInputSchema,
    outputSchema: GenerateServiceDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
