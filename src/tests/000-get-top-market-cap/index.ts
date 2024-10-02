import { ISeleniumContext } from '../../commons';
import { MochaTestDescribe, SeleniumTestPlan, TestCase } from '../../helper';
import { Browser } from 'selenium-webdriver';
import { Test001, Test002 } from './test-cases';

const testPlan = SeleniumTestPlan.withOptions<ISeleniumContext>({
  browser: Browser.CHROME,
  scope: '000-first-filter',
  testCaseResolver: ({ context }) => {
    return [
      TestCase.withOptions({
        name: 'Get market cap',
        description: 'Get market cap',
        handler: new Test001({
          context,
          args: {},
        }),
      }),
      TestCase.withOptions({
        name: 'Write market cap data into excel',
        description: 'Write market cap data into excel',
        handler: new Test002({
          context,
          args: {},
        }),
      }),
    ];
  },
});

MochaTestDescribe.withTestPlan({ testPlan }).run();
