import {
  DIContainerHelper,
  ApplicationLogger,
  TestCase,
  ITestHooks,
  ITestPlan,
  ITestPlanOptions,
  LoggerFactory,
  ITestCase,
} from '../../../helper';

export abstract class BaseTestPlan<R extends object> implements ITestPlan<R> {
  private logger: ApplicationLogger;
  private registry: DIContainerHelper<R>;
  private hooks: ITestHooks<R>;
  private testCases: Array<TestCase>;

  scope: string;

  constructor(opts: ITestPlanOptions<R>) {
    const { scope, testCases = [] } = opts;

    this.logger = LoggerFactory.getLogger([scope]);
    this.registry = DIContainerHelper.newInstance();

    this.scope = scope;
    this.hooks = opts.hooks ?? {};

    if (opts.testCaseResolver) {
      this.testCases = opts.testCaseResolver({ context: this });
    }

    this.withTestCases({ testCases });
  }

  getTestCases() {
    return this.testCases;
  }

  withTestCases(opts: { testCases: Array<ITestCase> }) {
    const { testCases } = opts;

    if (!this.testCases) {
      this.testCases = [];
    }

    for (const testCase of testCases) {
      this.testCases.push(new TestCase({ ...testCase }));
    }

    return this;
  }

  getHooks() {
    return this.hooks;
  }

  getHook(opts: { key: keyof ITestHooks<R> }) {
    return this.hooks?.[opts.key] ?? null;
  }

  getRegistry() {
    return this.registry;
  }

  bind<T>(opts: { key: string; value: T }) {
    const registry = this.getRegistry();
    registry.set<T>(opts.key, opts.value);
  }

  getSync<T>(opts: { key: keyof R }) {
    const registry = this.getRegistry();
    return registry.get<T>(opts.key);
  }

  execute() {
    this.logger.info('[run][%s] START RUNNING TEST CASE | Total test cases: %s', this.scope, this.testCases.length);

    if (!this.testCases.length) {
      this.logger.info('[run][%s] Not found test case(s)', this.scope);
      return;
    }

    for (const testCase of this.testCases) {
      const fn = () => {
        return testCase.run();
      };

      try {
        it(`RUN Test Case | name: ${testCase.name} - Description: ${testCase.description}`, fn);
      } catch (error) {
        this.logger.error('[%s][%s] Failed to finish test case | error: %s', this.scope, testCase.name, error);
      }
    }
  }
}
