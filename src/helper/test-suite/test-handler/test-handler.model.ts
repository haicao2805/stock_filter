import { ITestContext, Promisable } from '@/commons';
import { ITestCaseInput } from '../test-case';

export type TTestCaseDecision = 'SUCCESS' | 'FAIL' | 'UNKNOWN';

export class TestCaseDecisions {
  static readonly SUCCESS: TTestCaseDecision = 'SUCCESS';
  static readonly FAIL: TTestCaseDecision = 'FAIL';
  static readonly UNKNOWN: TTestCaseDecision = 'UNKNOWN';
}

export interface ITestCaseHandlerOptions<R extends object, I = {}> {
  context: ITestContext<R>;

  args: I | null;
  argResolver?: (...args: any[]) => I | null;
  validator?: (...args: any[]) => Promisable<TTestCaseDecision>;
}

export abstract class BaseTestCaseHandler<R extends object = {}, I extends ITestCaseInput = {}> {
  context: ITestContext<R>;
  args: I | null;
  protected validator?: (...args: any[]) => Promisable<TTestCaseDecision>;

  constructor(opts: ITestCaseHandlerOptions<R, I>) {
    this.context = opts.context;
    this.args = opts.args ?? opts.argResolver?.() ?? null;
    this.validator = opts.validator;
  }

  abstract validate(...args: any[]): Promisable<TTestCaseDecision>;
  abstract execute(): Promisable<void>;
}

export abstract class TestCaseHandler<R extends object = {}, I extends ITestCaseInput = {}> extends BaseTestCaseHandler<
  R,
  I
> {
  constructor(opts: ITestCaseHandlerOptions<R, I>) {
    super(opts);
  }
}
