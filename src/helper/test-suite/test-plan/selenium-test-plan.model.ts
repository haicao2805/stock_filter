import { ISeleniumContext, TValueOf } from '@/commons';
import { ITestPlanOptions, TestPlan } from '.';
import { IBrowser } from 'selenium-webdriver/lib/capabilities';
import { SeleniumHelper } from '../../../helper';

export class SeleniumTestPlan<R extends ISeleniumContext> extends TestPlan<R> {
  static withOptions<R extends ISeleniumContext>(opts: ITestPlanOptions<R> & { browser: TValueOf<IBrowser> }) {
    const { browser, ...testPlanOpts } = opts;

    return TestPlan.newInstance<R>({
      ...testPlanOpts,
      hooks: {
        before: async context => {
          const seleniumHelper = new SeleniumHelper({ browser });
          await seleniumHelper.initialize();
          context.bind<SeleniumHelper>({ key: 'seleniumHelper', value: seleniumHelper });
        },
        after: async context => {
          const seleniumHelper = context.getRegistry().get<SeleniumHelper>('seleniumHelper');
          await seleniumHelper.webDriver.close();
        },
        ...testPlanOpts?.hooks,
      },
    });
  }
}
