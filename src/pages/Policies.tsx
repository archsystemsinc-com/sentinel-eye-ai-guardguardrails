
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useMonitoring } from '@/contexts/MonitoringContext';

const Policies = () => {
  const { policies, rules, updatePolicy } = useMonitoring();
  const [editingPolicy, setEditingPolicy] = useState<any>(null);
  
  const handleEditPolicy = (policy: any) => {
    setEditingPolicy({
      ...policy,
      rules: [...policy.rules],
    });
  };
  
  const handleSavePolicy = () => {
    if (editingPolicy) {
      updatePolicy(editingPolicy);
      setEditingPolicy(null);
    }
  };
  
  const handleToggleRule = (ruleId: string) => {
    if (!editingPolicy) return;
    
    const ruleExists = editingPolicy.rules.some((rule: any) => rule.id === ruleId);
    let updatedRules;
    
    if (ruleExists) {
      updatedRules = editingPolicy.rules.filter((rule: any) => rule.id !== ruleId);
    } else {
      const ruleToAdd = rules.find(rule => rule.id === ruleId);
      if (ruleToAdd) {
        updatedRules = [...editingPolicy.rules, ruleToAdd];
      } else {
        updatedRules = [...editingPolicy.rules];
      }
    }
    
    setEditingPolicy({ ...editingPolicy, rules: updatedRules });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Policies</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {policies.map(policy => (
          <Card key={policy.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{policy.name}</CardTitle>
                  <CardDescription className="mt-1">{policy.description}</CardDescription>
                </div>
                <Switch checked={policy.enabled} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Active Rules</h4>
                <div className="flex flex-wrap gap-2">
                  {policy.rules.map(rule => (
                    <Badge key={rule.id} variant="outline">
                      {rule.name}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => handleEditPolicy(policy)}>
                      Edit Policy
                    </Button>
                  </DialogTrigger>
                  {editingPolicy && policy.id === editingPolicy.id && (
                    <DialogContent className="sm:max-w-[525px]">
                      <DialogHeader>
                        <DialogTitle>Edit Policy</DialogTitle>
                        <DialogDescription>
                          Configure the policy settings and rules
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Policy Name</Label>
                          <Input
                            id="name"
                            value={editingPolicy.name}
                            onChange={(e) => setEditingPolicy({ ...editingPolicy, name: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={editingPolicy.description}
                            onChange={(e) => setEditingPolicy({ ...editingPolicy, description: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Rules</Label>
                          <div className="border rounded-md p-4 space-y-3">
                            {rules.map(rule => {
                              const isEnabled = editingPolicy.rules.some((r: any) => r.id === rule.id);
                              return (
                                <div key={rule.id} className="flex items-start space-x-3">
                                  <Checkbox
                                    id={`rule-${rule.id}`}
                                    checked={isEnabled}
                                    onCheckedChange={() => handleToggleRule(rule.id)}
                                  />
                                  <div className="space-y-1">
                                    <Label
                                      htmlFor={`rule-${rule.id}`}
                                      className="font-medium"
                                    >
                                      {rule.name}
                                      <Badge className="ml-2" variant="outline">{rule.severity}</Badge>
                                    </Label>
                                    <p className="text-sm text-gray-500">
                                      {rule.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingPolicy(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSavePolicy}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Policies;
