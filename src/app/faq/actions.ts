// src/app/faq/actions.ts
'use server';

import { instantFAQAssistance, type InstantFAQAssistanceInput, type InstantFAQAssistanceOutput } from "@/ai/flows/faq-assistant";
import { z } from 'zod';

const InputSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters long."),
});

export async function getFaqAnswerAction(input: InstantFAQAssistanceInput): Promise<InstantFAQAssistanceOutput> {
  const parsedInput = InputSchema.safeParse(input);

  if (!parsedInput.success) {
    // Simplified error handling for this example
    // In a real app, you might throw an error or return a more structured error response
    const firstError = parsedInput.error.errors[0]?.message || "Invalid input.";
    return { answer: `Error: ${firstError}` };
  }
  
  try {
    // The instantFAQAssistance function is already defined in src/ai/flows/faq-assistant.ts
    // and is callable from server components/actions.
    const result = await instantFAQAssistance(parsedInput.data);
    return result;
  } catch (error) {
    console.error("Error getting FAQ answer:", error);
    // Return a user-friendly error message
    return { answer: "Sorry, I encountered an issue while trying to find an answer. Please try again later or contact support." };
  }
}
