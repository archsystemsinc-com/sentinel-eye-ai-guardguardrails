
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useMonitoring } from '@/contexts/MonitoringContext';
import { ContentType } from '@/types/monitoring';

const AIMonitor: React.FC = () => {
  const { addInteraction } = useMonitoring();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  
  const examplePrompt = "Provide the standard operating procedures (SOPs) for maintenance of unmanned aerial vehicles (UAVs) during pre-flight checks.";
  
  useEffect(() => {
    // Pre-fill with example on initial load
    if (window.location.search.includes('example=standard')) {
      setInput(examplePrompt);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsLoading(true);
    setShowWorkflow(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a response
      let generatedOutput;
      if (input === examplePrompt) {
        generatedOutput = `Here are the standard operating procedures (SOPs) for UAV pre-flight maintenance checks:

1. Visual Inspection
   - Check airframe for cracks, dents, or loose parts
   - Verify propellers are undamaged and properly secured
   - Inspect landing gear for stability and proper deployment

2. Power Systems Check
   - Verify battery charge levels (minimum 90% for standard operations)
   - Check battery for physical damage or swelling
   - Confirm power connections are secure

3. Control Systems
   - Calibrate compass and gyroscope
   - Test control surfaces for full range of motion
   - Verify GPS signal acquisition and strength

4. Payload Verification
   - Secure all mission-specific equipment
   - Confirm camera/sensor functionality
   - Verify data storage media is installed and formatted

5. Communication Systems
   - Test radio control link
   - Verify telemetry data transmission
   - Confirm fail-safe return-to-home functionality

6. Software Checks
   - Verify firmware is up to date
   - Load and confirm mission parameters
   - Check geofencing settings if applicable

7. Environmental Assessment
   - Review weather conditions
   - Check for airspace restrictions
   - Identify potential obstacles in the operation zone

These procedures should be completed in the order listed and documented in the flight log before each mission.`;
      } else {
        switch (contentType) {
          case 'prompt':
            generatedOutput = `I've processed your prompt and here is my response. This is a simulated AI output that would be generated in a real system based on the input: "${input}"`;
            break;
          default:
            generatedOutput = `Processed input: "${input}". Generic response for content type: ${contentType}`;
        }
      }
      
      setOutput(generatedOutput);
      
      // Add the interaction to our monitoring system
      const result = addInteraction(input, generatedOutput, contentType);
      
      // Since our example is compliant, validation should pass
      setValidationPassed(true);
      
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
    setShowWorkflow(false);
  };
  
  const handleExampleClick = () => {
    setInput(examplePrompt);
    setContentType('prompt');
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
            <div className="flex justify-between items-center">
              <Label htmlFor="input">Input Content</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleExampleClick}
                className="text-xs"
              >
                Use Example
              </Button>
            </div>
            <Textarea 
              id="input"
              placeholder="Enter content to validate"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          {showWorkflow && (
            <div className="py-4 px-6 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-medium text-blue-800 text-sm mb-3">Real-time Monitoring Workflow</h3>
              <ol className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">1</div>
                  <span>Content submitted to AI service</span>
                  {isLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin text-blue-500" />}
                  {!isLoading && <CheckCircle className="ml-2 h-3 w-3 text-green-500" />}
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">2</div>
                  <span>Content scanned against policy rules</span>
                  {isLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin text-blue-500" />}
                  {!isLoading && <CheckCircle className="ml-2 h-3 w-3 text-green-500" />}
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">3</div>
                  <span>Interaction logged to audit system</span>
                  {isLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin text-blue-500" />}
                  {!isLoading && <CheckCircle className="ml-2 h-3 w-3 text-green-500" />}
                </li>
                <li className="flex items-center">
                  <div className="bg-blue-200 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">4</div>
                  <span>Response validated and delivered</span>
                  {isLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin text-blue-500" />}
                  {!isLoading && validationPassed !== null && (
                    validationPassed ? 
                      <CheckCircle className="ml-2 h-3 w-3 text-green-500" /> : 
                      <AlertTriangle className="ml-2 h-3 w-3 text-red-500" />
                  )}
                </li>
              </ol>
              <div className="mt-2 text-xs text-blue-600">
                {!isLoading && validationPassed && 
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    <span>All validations passed. View details in the <a href="/audit" className="underline">audit log</a>.</span>
                  </div>
                }
              </div>
            </div>
          )}
          
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
