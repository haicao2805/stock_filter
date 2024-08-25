import assert from 'assert';
import { ISeleniumContext, Promisable } from '../../../commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import { FireantPage } from '../../../models';

export class Test002 extends TestCaseHandler<ISeleniumContext, {}> {
  validate(...args: any[]): Promisable<TTestCaseDecision> {
    throw new Error('Method not implemented.');
  }

  async execute() {
    const seleniumHelper = this.context.getSync<SeleniumHelper>({ key: 'seleniumHelper' });
    const driver = seleniumHelper.webDriver;

    if (!this.args) {
      assert.fail('[execute] Invalid arguments');
    }

    const fireantPage = new FireantPage({ seleniumHelper });

    // 1. Navigate to dashboard page
    await fireantPage.navigateToDashboardPage();
  }
}
