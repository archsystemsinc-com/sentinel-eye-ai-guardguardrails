
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMonitoring } from '@/contexts/MonitoringContext';
import { SeverityLevel, ContentType } from '@/types/monitoring';

const Rules = () => {
  const { rules, toggleRuleEnabled } = useMonitoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEnabled, setShowEnabled] = useState(true);
  const [showDisabled, setShowDisabled] = useState(true);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  
  // Filter rules based on search term and enabled/disabled filters
  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = (rule.enabled && showEnabled) || (!rule.enabled && showDisabled);
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Validation Rules</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Rule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Rule</DialogTitle>
              <DialogDescription>
                Create a new validation rule to be applied to AI content
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input id="name" placeholder="Enter rule name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe this rule's purpose" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pattern">Pattern (Regex)</Label>
                <Input id="pattern" placeholder="Enter regex pattern" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Content Types</Label>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="cursor-pointer">Prompt</Badge>
                  <Badge variant="outline" className="cursor-pointer">Completion</Badge>
                  <Badge variant="outline" className="cursor-pointer">Image</Badge>
                  <Badge variant="outline" className="cursor-pointer">Document</Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search rules..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Toggle
              pressed={showEnabled}
              onPressedChange={setShowEnabled}
            >
              Enabled
            </Toggle>
            <Toggle
              pressed={showDisabled}
              onPressedChange={setShowDisabled}
            >
              Disabled
            </Toggle>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredRules.map(rule => (
          <Card key={rule.id} className={!rule.enabled ? 'opacity-75' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {rule.name}
                    <Badge className="ml-2" variant={getSeverityVariant(rule.severity)}>
                      {rule.severity}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{rule.description}</CardDescription>
                </div>
                <Toggle
                  pressed={rule.enabled}
                  onPressedChange={() => toggleRuleEnabled(rule.id)}
                >
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </Toggle>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm">
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Pattern: </span>
                  <code className="bg-gray-100 px-2 py-0.5 rounded">{rule.pattern}</code>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Applies to: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {rule.contentTypes.map((type: ContentType) => (
                      <Badge key={type} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              <div className="flex justify-end w-full">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedRule(rule)}>
                      View Rule
                    </Button>
                  </DialogTrigger>
                  
                  {selectedRule && selectedRule.id === rule.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rule Details</DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-500">Name</Label>
                          <div className="font-medium text-lg">{selectedRule.name}</div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">Description</Label>
                          <div>{selectedRule.description}</div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">Pattern</Label>
                          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                            {selectedRule.pattern}
                          </pre>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">Severity</Label>
                            <div>
                              <Badge variant={getSeverityVariant(selectedRule.severity)}>
                                {selectedRule.severity}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm text-gray-500">Status</Label>
                            <div>
                              <Badge variant={selectedRule.enabled ? "default" : "outline"}>
                                {selectedRule.enabled ? "Enabled" : "Disabled"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-gray-500">Content Types</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedRule.contentTypes.map((type: ContentType) => (
                              <Badge key={type} variant="outline">{type}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRule(null)}>
                          Close
                        </Button>
                        <Button 
                          variant={selectedRule.enabled ? "destructive" : "default"}
                          onClick={() => {
                            toggleRuleEnabled(selectedRule.id);
                            setSelectedRule({...selectedRule, enabled: !selectedRule.enabled});
                          }}
                        >
                          {selectedRule.enabled ? "Disable Rule" : "Enable Rule"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {filteredRules.length === 0 && (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">No rules found matching your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to determine badge variant based on severity
function getSeverityVariant(severity: SeverityLevel): "default" | "destructive" | "outline" | "secondary" {
  switch (severity) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
}

export default Rules;
