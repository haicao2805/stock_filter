import { ISeleniumContext } from '@/commons';
import { MochaTestDescribe, SeleniumTestPlan, TestCase } from '../../helper';
import { Browser } from 'selenium-webdriver';
import { Test001 } from './test-cases/test-001';

const testPlan = SeleniumTestPlan.withOptions<ISeleniumContext>({
  browser: Browser.CHROME,
  scope: '000-1b-market-cap',
  testCaseResolver: ({ context }) => {
    return [
      TestCase.withOptions({
        name: 'Get 1b market cap',
        description: 'Get 1b market cap',
        handler: new Test001({
          context,
          args: {},
        }),
      }),
    ];
  },
});

MochaTestDescribe.withTestPlan({ testPlan }).run();

