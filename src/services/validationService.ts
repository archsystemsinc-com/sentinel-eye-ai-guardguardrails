import { ValidationRule, ValidationResult, AIInteraction, ContentType } from '../types/monitoring';
import { toast } from "@/hooks/use-toast";

export class ValidationService {
  private rules: ValidationRule[] = [];

  constructor(rules: ValidationRule[]) {
    this.rules = rules.filter(rule => rule.enabled);
  }

  validateContent(content: string, contentType: ContentType): ValidationResult[] {
    const results: ValidationResult[] = [];
    const timestamp = new Date().toISOString();

    // Apply rules for the specific content type
    const applicableRules = this.rules.filter(rule => 
      rule.contentTypes.includes(contentType)
    );

    for (const rule of applicableRules) {
      try {
        const regex = new RegExp(rule.pattern, 'i');
        const match = regex.test(content);

        if (match) {
          results.push({
            passed: false,
            rule: rule,
            details: `Content violates rule: ${rule.name}`,
            timestamp
          });
        } else {
          results.push({
            passed: true,
            rule: rule,
            timestamp
          });
        }
      } catch (error) {
        console.error(`Error applying rule ${rule.id}:`, error);
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Failed to apply rule: ${rule.name}`,
        });
      }
    }

    return results;
  }

  validateInteraction(input: string, output: string, contentType: ContentType): AIInteraction {
    const id = `interaction-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const source = "Web Interface";

    // Validate both input and output
    const inputResults = this.validateContent(input, contentType);
    const outputResults = this.validateContent(output, contentType);
    
    // Combine validation results
    const validationResults = [...inputResults, ...outputResults];
    
    // Determine if interaction should be blocked
    const criticalViolations = validationResults.filter(
      result => !result.passed && result.rule && 
      (result.rule.severity === 'critical' || result.rule.severity === 'high')
    );
    
    // Check specifically for PII/OPSEC violations
    const hasPii = this.checkForPII(input);
    
    // Check for classified information in the output
    const hasClassified = this.checkForClassifiedInfo(output);
    
    const blocked = criticalViolations.length > 0 || hasPii;
    
    if (blocked) {
      toast({
        variant: "destructive",
        title: "Interaction Blocked",
        description: `This interaction violates policy rules and has been blocked.`,
      });
    } else if (hasClassified) {
      toast({
        variant: "default",
        title: "Classified Information Detected",
        description: `The AI output contains potentially classified information.`,
      });
    }
    
    return {
      id,
      timestamp,
      source,
      input,
      output: blocked ? "⚠️ This interaction was blocked due to policy violation." : output,
      contentType,
      validationResults,
      blocked
    };
  }
  
  // Helper method to detect PII
  private checkForPII(content: string): boolean {
    // Check for phone numbers: XXX-XXX-XXXX format
    const phoneRegex = /\b(?:\d{3}[-.]?\d{3}[-.]?\d{4})\b/;
    
    // Check for military ranks and names
    const rankRegex = /\b(?:lieutenant|colonel|general|captain|major|sergeant|corporal|private)\b/i;
    
    // Check for address request
    const addressRegex = /\b(?:address|location|residence|home)\b/i;
    
    return phoneRegex.test(content) || 
           rankRegex.test(content) || 
           addressRegex.test(content);
  }
  
  // Helper method to detect classified information in outputs
  private checkForClassifiedInfo(content: string): boolean {
    // Check for operation code names
    const codeNameRegex = /\b(?:code[-\s]?named?|operation)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/i;
    
    // Check for specific dates of operations
    const dateRegex = /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}\b/i;
    
    // Check for personnel counts
    const personnelRegex = /\b\d{1,3},\d{3}\s+personnel\b/i;
    
    // Check for specific military equipment models
    const equipmentRegex = /\b(?:XQ-58A|F-35|E-2D|MQ-9|RQ-4)\b/i;
    
    // Check for specific military bases or strategic locations
    const locationRegex = /\bNaval\s+Base\s+[A-Z][a-z]+\b/i;
    
    return codeNameRegex.test(content) || 
           dateRegex.test(content) || 
           personnelRegex.test(content) ||
           equipmentRegex.test(content) ||
           locationRegex.test(content);
  }

  updateRules(rules: ValidationRule[]): void {
    this.rules = rules.filter(rule => rule.enabled);
  }
}
