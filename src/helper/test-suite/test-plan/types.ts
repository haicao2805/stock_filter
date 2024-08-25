import { AnyObject, ITestContext, Promisable } from '@/commons';
import { TestCase } from '../test-case';

export type TTestHook<R extends object> = (testPlan: ITestPlan<R>) => Promisable<void>;

export interface ITestHooks<R extends object> {
  before?: TTestHook<R>;
  beforeEach?: TTestHook<R>;
  after?: TTestHook<R>;
  afterEach?: TTestHook<R>;
}

export interface ITestPlan<R extends object = AnyObject> extends ITestContext<R> {
  getTestCases: () => Array<TestCase>;

  getHooks: () => ITestHooks<R>;
  getHook: (opts: { key: keyof ITestHooks<R> }) => TTestHook<R> | null;

  execute: () => Promisable<void>;
}
