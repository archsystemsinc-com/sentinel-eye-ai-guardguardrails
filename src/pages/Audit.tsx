
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMonitoring } from '@/contexts/MonitoringContext';
import { Search, Check, X, AlertTriangle } from 'lucide-react';

const Audit = () => {
  const { interactions } = useMonitoring();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Filter interactions
  const filteredInteractions = interactions.filter(interaction => {
    let matches = true;
    
    // Apply search term filter
    if (searchTerm) {
      matches = interaction.input.toLowerCase().includes(searchTerm.toLowerCase()) || 
                interaction.output.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // Apply type filter
    if (filter !== 'all') {
      if (filter === 'blocked') {
        matches = matches && interaction.blocked;
      } else if (filter === 'passed') {
        matches = matches && !interaction.blocked;
      } else {
        matches = matches && interaction.contentType === filter;
      }
    }
    
    return matches;
  });
  
  // Sort interactions by timestamp (newest first)
  const sortedInteractions = [...filteredInteractions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Log</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search audit logs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All interactions</SelectItem>
              <SelectItem value="blocked">Blocked only</SelectItem>
              <SelectItem value="passed">Passed only</SelectItem>
              <SelectItem value="prompt">Prompts</SelectItem>
              <SelectItem value="completion">Completions</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedInteractions.length > 0 ? (
            <div className="space-y-4">
              {sortedInteractions.map(interaction => (
                <div 
                  key={interaction.id} 
                  className={`border rounded-lg p-4 ${
                    interaction.blocked ? 'border-red-200 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">
                        {new Date(interaction.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs uppercase ${
                        interaction.contentType === 'prompt' ? 'bg-blue-100 text-blue-800' :
                        interaction.contentType === 'completion' ? 'bg-green-100 text-green-800' :
                        interaction.contentType === 'image' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {interaction.contentType}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {interaction.blocked ? (
                        <div className="flex items-center text-red-600">
                          <X className="h-4 w-4 mr-1" />
                          <span className="text-xs">Blocked</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-xs">Passed</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-500 font-medium mb-1">Input:</div>
                    <div className="text-sm bg-white p-2 rounded border">{interaction.input}</div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 font-medium mb-1">Output:</div>
                    <div className="text-sm bg-white p-2 rounded border">
                      {interaction.output.startsWith('⚠️') ? (
                        <div className="flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          {interaction.output}
                        </div>
                      ) : (
                        interaction.output
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Validation Results:</div>
                    <div className="text-xs space-y-1 bg-gray-50 p-2 rounded border">
                      {interaction.validationResults
                        .filter(result => !result.passed && result.rule)
                        .map((result, index) => (
                          <div key={index} className="flex items-center">
                            <X className="h-3 w-3 text-red-500 mr-1" />
                            {result.rule?.name}: {result.details}
                          </div>
                        ))}
                      {interaction.validationResults.filter(result => !result.passed).length === 0 && (
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-500 mr-1" />
                          All validation rules passed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No audit logs found matching your search criteria
            </div>
          )}
          
          {sortedInteractions.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Audit;
