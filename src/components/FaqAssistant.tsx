'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Send, Sparkles } from 'lucide-react';
import { getFaqAnswerAction } from '@/app/faq/actions'; // Server action
import { faqExamples } from '@/lib/constants'; // Example questions

const FaqAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement> | string) => {
    let currentQuestion = '';
    if (typeof event === 'string') {
      currentQuestion = event;
      setQuestion(event); // Update input field if example is clicked
    } else {
      event.preventDefault();
      currentQuestion = question;
    }

    if (!currentQuestion.trim()) {
      setError('Please enter a question.');
      return;
    }

    setIsLoading(true);
    setAnswer('');
    setError('');

    try {
      const result = await getFaqAnswerAction({ question: currentQuestion });
      setAnswer(result.answer);
    } catch (err) {
      setError('Failed to get an answer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleQuestion: string) => {
    handleSubmit(exampleQuestion);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center p-4 md:p-6">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Bot className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold">EggyPro AI Assistant</CardTitle>
        </div>
        <CardDescription className="text-sm md:text-base lg:text-lg">
          Have questions about EggyPro, shipping, or our policies? Ask away!
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., What are the ingredients?"
              className="flex-grow h-11 md:h-10"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 min-h-[44px] md:min-h-[40px] w-full sm:w-auto">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">Ask</span>
              <span className="ml-2 sm:hidden">Ask Question</span>
            </Button>
          </div>
          {error && <p className="text-sm md:text-base text-destructive px-2">{error}</p>}
        </form>

        {answer && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-secondary/50 rounded-lg border border-border">
            <h4 className="font-semibold text-primary mb-2 md:mb-3 flex items-center gap-1 text-sm md:text-base">
              <Sparkles className="h-4 w-4" /> Answer:
            </h4>
            <Textarea value={answer} readOnly rows={4} className="bg-background text-foreground text-sm md:text-base resize-none" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 md:gap-4 pt-4 border-t p-4 md:p-6">
        <p className="text-sm md:text-base text-muted-foreground">Or try one of these common questions:</p>
        <div className="flex flex-wrap gap-2 md:gap-3 w-full">
          {faqExamples.map((ex, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm" 
              onClick={() => handleExampleClick(ex)}
              disabled={isLoading}
              className="text-xs md:text-sm min-h-[36px] md:min-h-[32px] flex-shrink-0"
            >
              {ex}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FaqAssistant;
