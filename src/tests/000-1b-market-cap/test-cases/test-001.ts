import { ISeleniumContext, Promisable } from '@/commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import assert from 'assert';

export class Test001 extends TestCaseHandler<ISeleniumContext, {}> {
  validate(...args: any[]): Promisable<TTestCaseDecision> {
    throw new Error('Method not implemented.');
  }

  async execute() {
    const seleniumHelper = this.context.getSync<SeleniumHelper>({ key: 'seleniumHelper' });

    if (!this.args) {
      assert.fail('[execute] Invalid arguments');
    }

    const driver = seleniumHelper.webDriver;

    await driver.get('https://fireant.vn/dashboard');
    await driver.manage().window().maximize();

await driver.sleep(100000);
  }
}
