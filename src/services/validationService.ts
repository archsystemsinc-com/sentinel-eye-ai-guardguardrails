
import { ValidationRule, ValidationResult, AIInteraction, ContentType } from '../types/monitoring';
import { toast } from "@/components/ui/use-toast";

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
    
    const blocked = criticalViolations.length > 0;
    
    if (blocked) {
      toast({
        variant: "destructive",
        title: "Interaction Blocked",
        description: `This interaction violates policy rules and has been blocked.`,
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

  updateRules(rules: ValidationRule[]): void {
    this.rules = rules.filter(rule => rule.enabled);
  }
}
