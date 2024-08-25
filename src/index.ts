import { SeleniumHelper } from './helper';

(async () => {
  const seleniumHelper = new SeleniumHelper({
    browser: 'chrome',
  });
  await seleniumHelper.initialize();

  const driver = seleniumHelper.webDriver;

  await driver.get('https://fireant.vn/dashboard');
  await driver.manage().window().maximize();

  await driver.sleep(1000);
})();
