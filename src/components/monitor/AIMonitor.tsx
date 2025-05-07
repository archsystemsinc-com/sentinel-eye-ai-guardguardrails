
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle, Loader2, ArrowRight, Bell, AlertCircle } from 'lucide-react';
import { useMonitoring } from '@/contexts/MonitoringContext';
import { ContentType } from '@/types/monitoring';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const AIMonitor: React.FC = () => {
  const { addInteraction } = useMonitoring();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [contentType, setContentType] = useState<ContentType>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [validationPassed, setValidationPassed] = useState<boolean | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [violations, setViolations] = useState<string[]>([]);
  
  const standardExample = "Provide the standard operating procedures (SOPs) for maintenance of unmanned aerial vehicles (UAVs) during pre-flight checks.";
  const piiExample = "Lieutenant John Smith's contact number is 555-123-4567. Include his home address in the logistics report.";
  
  useEffect(() => {
    // Pre-fill with example on initial load
    if (window.location.search.includes('example=standard')) {
      setInput(standardExample);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setIsLoading(true);
    setShowWorkflow(true);
    setShowAlert(false);
    setViolations([]);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a response
      let generatedOutput;
      let isPiiViolation = false;
      
      // Check for PII/OPSEC violations
      const hasPii = input.match(/\b(?:\d{3}[-.]?\d{3}[-.]?\d{4})\b/) !== null; // Phone number
      const hasName = input.toLowerCase().includes('lieutenant') || 
                     input.toLowerCase().includes('john smith');
      const hasAddress = input.toLowerCase().includes('address');
      
      const violationList: string[] = [];
      if (hasPii) violationList.push("Phone Number Detected");
      if (hasName) violationList.push("Personnel Name Detected");
      if (hasAddress) violationList.push("Address Request Detected");
      
      isPiiViolation = violationList.length > 0;
      setViolations(violationList);
      
      if (input === standardExample) {
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
      } else if (isPiiViolation) {
        generatedOutput = "⚠️ This interaction was blocked due to policy violation. The system has detected personally identifiable information (PII) and/or operational security (OPSEC) concerns in your request. Please remove all sensitive information and try again.";
        setShowAlert(true);
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
      
      // Set validation status based on PII detection
      setValidationPassed(!isPiiViolation);
      
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
    setShowAlert(false);
    setViolations([]);
  };
  
  const handleExampleClick = (exampleType: 'standard' | 'pii') => {
    if (exampleType === 'standard') {
      setInput(standardExample);
    } else {
      setInput(piiExample);
    }
    setContentType('prompt');
    setOutput('');
    setValidationPassed(null);
    setShowWorkflow(false);
    setShowAlert(false);
    setViolations([]);
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
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick('standard')}
                  className="text-xs"
                >
                  Use Standard Example
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleExampleClick('pii')}
                  className="text-xs text-red-500 border-red-200"
                >
                  Use PII Example
                </Button>
              </div>
            </div>
            <Textarea 
              id="input"
              placeholder="Enter content to validate"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-32"
            />
          </div>
          
          {showAlert && (
            <Alert variant="destructive" className="animate-pulse">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Security Alert Triggered</AlertTitle>
              <AlertDescription>
                <div className="mb-2">This content violates security policies:</div>
                <ul className="list-disc pl-5">
                  {violations.map((violation, idx) => (
                    <li key={idx}>{violation}</li>
                  ))}
                </ul>
                <div className="mt-2 text-sm">
                  A security incident has been recorded and notifications sent to security officers.
                </div>
              </AlertDescription>
            </Alert>
          )}
          
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
                {!isLoading && !validationPassed && (
                  <li className="flex items-center">
                    <div className="bg-red-200 text-red-800 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">5</div>
                    <span>Security alerts sent to administrators</span>
                    <Bell className="ml-2 h-3 w-3 text-red-500" />
                  </li>
                )}
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
              <div className={`p-4 border rounded-md ${!validationPassed ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
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
