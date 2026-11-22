
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// process.env should be populated by Next.js for runtime
// or by dotenv in src/ai/dev.ts for `genkit dev`.
const apiKey =
  process.env.GOOGLE_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_GENAI_API_KEY ||
  process.env.PROOFLIGHT_GOOGLE_AI_API_KEY;

if (!apiKey) {
  const errorMessage =
    'API KEY MISSING: The GOOGLE_API_KEY (or GEMINI_API_KEY) is not set in your environment.\n' +
    'Please ensure you have a .env file in the root of your project with the following format:\n' +
    'GOOGLE_API_KEY="YOUR_ACTUAL_API_KEY_HERE"\n\n' +
    'If you are running in a deployed environment, make sure the environment variable is set there.\n' +
    'For more details on obtaining and setting up your API key, ' +
    'visit https://firebase.google.com/docs/genkit/plugins/google-genai';
  console.error('Startup Error: ' + errorMessage);
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || '',
    }),
  ],
  model: 'googleai/gemini-2.0-flash', // Default model for this genkit() instance
});
