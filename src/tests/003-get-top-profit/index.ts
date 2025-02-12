import { ISeleniumContext } from '../../commons';
import { MochaTestDescribe, SeleniumTestPlan, TestCase } from '../../helper';
import { Browser } from 'selenium-webdriver';
import { Test001, Test002, Test003 } from './test-case';

const testPlan = SeleniumTestPlan.withOptions<ISeleniumContext>({
  browser: Browser.CHROME,
  scope: '000-first-filter',
  testCaseResolver: ({ context }) => {
    return [
      // TestCase.withOptions({
      //   name: 'Get top profit',
      //   description: 'Get top profit',
      //   handler: new Test001({
      //     context,
      //     args: {},
      //   }),
      // }),
      // TestCase.withOptions({
      //   name: 'Write profit data into excel',
      //   description: 'Write profit data into excel',
      //   handler: new Test002({
      //     context,
      //     args: {},
      //   }),
      // }),
      TestCase.withOptions({
        name: 'Read last 5 years profit',
        description: 'Read last 5 years profit',
        handler: new Test003({
          context,
          args: {},
        }),
      }),
    ];
  },
});

MochaTestDescribe.withTestPlan({ testPlan }).run();
