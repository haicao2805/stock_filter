import { TestCaseHandler } from '../test-handler';

export interface ITestCaseOption {
  name: string;
  description: string;
  handler: TestCaseHandler;
}

export class TestCase {
  name: string;
  description: string;
  handler: TestCaseHandler;

  constructor(opts: ITestCaseOption) {
    this.name = opts.name;
    this.description = opts.description;
    this.handler = opts.handler;
  }

  static withOptions(opts: ITestCaseOption) {
    return new TestCase(opts);
  }

  run() {
    return Promise.resolve(this.handler.execute());
  }
}
