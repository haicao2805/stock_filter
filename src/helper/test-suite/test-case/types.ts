import { TestCaseHandler } from '../test-handler';

export interface ITestCaseInput {}

export interface ITestCase {
  name: string;
  description: string;
  handler: TestCaseHandler;
}
