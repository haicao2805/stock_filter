import { ApplicationLogger, LoggerFactory } from './logger.helper';
import { ITestPlan } from './test-suite';

export class MochaTestDescribe<R extends object> {
  private testPlan: ITestPlan<R>;
  private logger: ApplicationLogger;

  private constructor(opts: { testPlan: ITestPlan<R> }) {
    this.testPlan = opts.testPlan;
    this.logger = LoggerFactory.getLogger([MochaTestDescribe.name]);
  }

  static withTestPlan<R extends object>(opts: { testPlan: ITestPlan<R> }) {
    const testDescribe = new MochaTestDescribe(opts);
    return testDescribe;
  }

  run() {
    if (!this.testPlan) {
      throw Error(`[run] Invalid test plan!`);
    }

    const suiteFn = () => {
      before(async () => {
        const hook = this.testPlan.getHook({ key: 'before' });
        await hook?.(this.testPlan);
      });

      beforeEach(async () => {
        const hook = this.testPlan.getHook({ key: 'beforeEach' });
        await hook?.(this.testPlan);
      });

      after(async () => {
        const hook = this.testPlan.getHook({ key: 'after' });
        await hook?.(this.testPlan);
      });

      afterEach(async () => {
        const hook = this.testPlan.getHook({ key: 'afterEach' });
        await hook?.(this.testPlan);
      });

      this.logger.info('[run][%s] START executing test plan!', this.testPlan.scope);
      this.testPlan.execute();
    };

    describe(this.testPlan.scope, suiteFn);
  }
}
