
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useMonitoring } from '@/contexts/MonitoringContext';
import { ContentType } from '@/types/monitoring';

const AIMonitor: React.FC = () => {
  const { addInteraction } = useMonitoring();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a simple response
      let generatedOutput;
      switch (contentType) {
        case 'prompt':
          generatedOutput = `I've processed your prompt and here is my response. This is a simulated AI output that would be generated in a real system based on the input: "${input}"`;
          break;
        case 'completion':
          generatedOutput = `Completion generated for: "${input}". This would typically be a text completion or continuation.`;
          break;
        case 'image':
          generatedOutput = `[Image description]: An image would be generated based on: "${input}"`;
          break;
        case 'document':
          generatedOutput = `Document analysis for: "${input}". In a real system, this would contain document processing results.`;
          break;
        default:
          generatedOutput = `Processed input: "${input}". Generic response for content type: ${contentType}`;
      }
      
      setOutput(generatedOutput);
      
      // Add the interaction to our monitoring system
      addInteraction(input, generatedOutput, contentType);
      
      // Simulate validation result (this is arbitrary; the real validation happens in addInteraction)
      setValidationPassed(input.length > 10 && !input.includes('password') && !input.includes('123-45'));
      
    } catch (error) {
      console.error('Error processing input:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setInput('');
    setOutput('');
    setValidationPassed(null);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Interaction Monitor</CardTitle>
        <CardDescription>
          Test content validation against security policies in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select 
              value={contentType} 
              onValueChange={(value) => setContentType(value as ContentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="completion">Completion</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="input">Input Content</Label>
            <Textarea 
              id="input"
              placeholder="Enter content to validate (try including sensitive data like: 'my SSN is 123-45-6789')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          {output && (
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">Output Content</Label>
                {validationPassed !== null && (
                  <div className="flex items-center">
                    {validationPassed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Passed validation</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Failed validation</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 bg-gray-50 border rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{output}</pre>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset
        </Button>
        <Button onClick={handleSubmit} disabled={!input.trim() || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Validate & Process'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIMonitor;
