
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AIInteraction, 
  Incident, 
  ValidationRule, 
  Policy,
  DashboardMetrics
} from '../types/monitoring';
import { ValidationService } from '../services/validationService';
import { 
  sampleRules, 
  samplePolicies, 
  generateMockInteractions, 
  generateMockIncidents,
  calculateDashboardMetrics
} from '../services/mockData';
import { useToast } from "@/components/ui/use-toast";

interface MonitoringContextType {
  interactions: AIInteraction[];
  incidents: Incident[];
  rules: ValidationRule[];
  policies: Policy[];
  metrics: DashboardMetrics | null;
  validationService: ValidationService;
  addInteraction: (input: string, output: string, contentType: string) => void;
  updateIncidentStatus: (id: string, status: 'open' | 'investigating' | 'resolved' | 'false-positive', notes?: string) => void;
  toggleRuleEnabled: (ruleId: string) => void;
  updatePolicy: (policy: Policy) => void;
  isLoading: boolean;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export const MonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interactions, setInteractions] = useState<AIInteraction[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [rules, setRules] = useState<ValidationRule[]>(sampleRules);
  const [policies, setPolicies] = useState<Policy[]>(samplePolicies);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize validation service
  const [validationService] = useState<ValidationService>(() => new ValidationService(rules));

  // Load mock data
  useEffect(() => {
    const loadMockData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data
        const mockInteractions = generateMockInteractions(50);
        const mockIncidents = generateMockIncidents(mockInteractions);
        
        setInteractions(mockInteractions);
        setIncidents(mockIncidents);
        
        // Calculate metrics
        const dashboardMetrics = calculateDashboardMetrics(mockInteractions, mockIncidents);
        setMetrics(dashboardMetrics);
        
        toast({
          title: "System Ready",
          description: "AI Monitoring System has been initialized",
        });
      } catch (error) {
        console.error("Error loading mock data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize the monitoring system",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMockData();
  }, [toast]);

  // Update metrics when interactions or incidents change
  useEffect(() => {
    if (interactions.length > 0 && incidents.length > 0) {
      const updatedMetrics = calculateDashboardMetrics(interactions, incidents);
      setMetrics(updatedMetrics);
    }
  }, [interactions, incidents]);

  // Add a new AI interaction
  const addInteraction = (input: string, output: string, contentType: string) => {
    try {
      const newInteraction = validationService.validateInteraction(
        input, 
        output, 
        contentType as any
      );
      
      setInteractions(prev => [newInteraction, ...prev]);
      
      // Create incidents for any violations
      const failedResults = newInteraction.validationResults.filter(result => !result.passed && result.rule);
      
      if (failedResults.length > 0) {
        const newIncidents = failedResults.map((result, index) => {
          if (result.rule) {
            return {
              id: `incident-${Date.now()}-${index}`,
              timestamp: newInteraction.timestamp,
              aiInteractionId: newInteraction.id,
              severity: result.rule.severity,
              rule: result.rule,
              content: newInteraction.input,
              status: 'open' as 'open'
            };
          }
          return null;
        }).filter(Boolean) as Incident[];
        
        setIncidents(prev => [...newIncidents, ...prev]);
        
        if (newIncidents.length > 0) {
          toast({
            variant: "warning",
            title: "Policy Violation Detected",
            description: `${newIncidents.length} violation(s) found in recent interaction`,
          });
        }
      }
    } catch (error) {
      console.error("Error adding interaction:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the AI interaction",
      });
    }
  };

  // Update the status of an incident
  const updateIncidentStatus = (
    id: string, 
    status: 'open' | 'investigating' | 'resolved' | 'false-positive', 
    notes?: string
  ) => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === id 
          ? { ...incident, status, resolutionNotes: notes } 
          : incident
      )
    );
    
    toast({
      title: "Incident Updated",
      description: `Incident status changed to ${status}`,
    });
  };
  
  // Toggle the enabled state of a rule
  const toggleRuleEnabled = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled } 
          : rule
      )
    );
    
    // Update validation service with new rules
    validationService.updateRules(
      rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled } 
          : rule
      )
    );
    
    toast({
      title: "Rule Updated",
      description: "Validation rule status has been changed",
    });
  };
  
  // Update a policy
  const updatePolicy = (updatedPolicy: Policy) => {
    setPolicies(prev => 
      prev.map(policy => 
        policy.id === updatedPolicy.id 
          ? updatedPolicy 
          : policy
      )
    );
    
    toast({
      title: "Policy Updated",
      description: `Policy "${updatedPolicy.name}" has been updated`,
    });
  };

  const contextValue: MonitoringContextType = {
    interactions,
    incidents,
    rules,
    policies,
    metrics,
    validationService,
    addInteraction,
    updateIncidentStatus,
    toggleRuleEnabled,
    updatePolicy,
    isLoading
  };

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
};

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  
  if (context === undefined) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  
  return context;
};
