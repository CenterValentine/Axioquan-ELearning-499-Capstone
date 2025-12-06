/**
 * Mock Code Runner
 * Simulates code execution for UI development
 * Returns random outputs to make it look functional
 */

import { CodeExecutionResult, TestResult, TestCase, CodeSubmissionResult } from './types';

/**
 * Mock code execution - returns random output
 */
export async function mockExecuteCode(
  code: string,
  language: string
): Promise<CodeExecutionResult> {
  // Simulate execution delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  // Random chance of "error" (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      output: '',
      error: 'SyntaxError: Unexpected token at line 5',
      executionTime: Math.floor(200 + Math.random() * 300),
    };
  }

  // Generate random output
  const randomNumber = Math.floor(Math.random() * 1000);
  const randomString = `Result: ${randomNumber}\nExecution completed successfully.`;

  return {
    success: true,
    output: randomString,
    executionTime: Math.floor(100 + Math.random() * 500),
  };
}

/**
 * Mock test case validation
 */
export async function mockValidateTestCases(
  code: string,
  testCases: TestCase[],
  language: string
): Promise<TestResult[]> {
  // Simulate validation delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  return testCases.map((testCase, index) => {
    // Random pass/fail (70% pass rate for demo)
    const passed = Math.random() < 0.7;
    const actualOutput = passed 
      ? testCase.expectedOutput 
      : `Output ${Math.floor(Math.random() * 100)}`;

    return {
      testCase,
      passed,
      actualOutput,
      executionTime: Math.floor(50 + Math.random() * 200),
      ...(passed ? {} : { error: 'Output does not match expected result' }),
    };
  });
}

/**
 * Mock code submission with grading
 */
export async function mockSubmitCode(
  code: string,
  testCases: TestCase[],
  language: string
): Promise<CodeSubmissionResult> {
  const testResults = await mockValidateTestCases(code, testCases, language);
  
  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const score = Math.floor((passedTests / totalTests) * 100);

  // Generate feedback
  let feedback = '';
  if (score === 100) {
    feedback = 'Excellent! All test cases passed. Your solution is correct!';
  } else if (score >= 70) {
    feedback = `Good work! You passed ${passedTests} out of ${totalTests} test cases.`;
  } else {
    feedback = `You passed ${passedTests} out of ${totalTests} test cases. Review the failing tests and try again.`;
  }

  return {
    success: true,
    score,
    totalTests,
    passedTests,
    testResults,
    feedback,
  };
}

