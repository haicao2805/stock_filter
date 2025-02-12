import { ISeleniumContext } from '../../commons';
import { MochaTestDescribe, SeleniumTestPlan, TestCase } from '../../helper';
import { Browser } from 'selenium-webdriver';
import { Test001 } from './test-cases';

const testPlan = SeleniumTestPlan.withOptions<ISeleniumContext>({
  browser: Browser.CHROME,
  scope: '000-first-filter',
  testCaseResolver: ({ context }) => {
    return [
      TestCase.withOptions({
        name: 'Get stock dividend',
        description: 'Get stock dividend',
        handler: new Test001({
          context,
          args: {},
        }),
      }),
    ];
  },
});

MochaTestDescribe.withTestPlan({ testPlan }).run();
