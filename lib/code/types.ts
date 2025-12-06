/**
 * Code Environment Types
 * Defines the structure for code lesson data stored in the code_environment field
 */

export interface CodeEnvironment {
  language: string; // "javascript", "python", "typescript", etc.
  starterCode?: string; // Initial code provided to students
  solutionCode?: string; // Reference solution (for instructors only)
  instructions: string; // Markdown/HTML instructions
  testCases?: TestCase[];
  dependencies?: string[]; // npm packages, pip packages, etc.
  runtime?: string; // Node version, Python version, etc.
  allowRun?: boolean; // Can students execute code?
  allowSubmit?: boolean; // Can students submit for grading?
  timeLimit?: number; // Execution time limit in seconds
  memoryLimit?: number; // Memory limit in MB
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean; // For hidden test cases
  description?: string; // Optional description of what this test checks
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number; // in milliseconds
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput?: string;
  error?: string;
  executionTime?: number;
}

export interface CodeSubmissionResult {
  success: boolean;
  score: number; // 0-100
  totalTests: number;
  passedTests: number;
  testResults: TestResult[];
  feedback?: string;
}
