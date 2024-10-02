import assert from 'assert';
import { FireantSelectors, ISeleniumContext, Promisable } from '../../../commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import { FireantPage } from '../../../models';
import fs from 'fs';
import dayjs from 'dayjs';
import { DataMarketCap } from '../../000-get-top-market-cap/test-cases/test-001';

export class Test002 extends TestCaseHandler<ISeleniumContext, {}> {
  validate(): Promisable<TTestCaseDecision> {
    throw new Error('Method not implemented.');
  }

  async execute() {
    const seleniumHelper = this.context.getSync<SeleniumHelper>({ key: 'seleniumHelper' });
    const driver = seleniumHelper.webDriver;

    if (!this.args) {
      assert.fail('[execute] Invalid arguments');
    }

    const fireantPage = new FireantPage({ seleniumHelper });

    await driver.manage().window().maximize();

    const topMaketCapData = JSON.parse(
      Buffer.from(fs.readFileSync(`resources/top-market-cap-${dayjs().format('YYYYMMDD')}.json`)).toString(),
    ) as { data: DataMarketCap[] };

    // 1. Navigate first stock and close popup
    await fireantPage.navigateToStockInfoPage('VNM');
    await fireantPage.closePopupsIfExistStockInfoPage();

    const filterdData: DataMarketCap[] = [];
    // 2. Loop stock list and get data
    let stockList = topMaketCapData.data;

    stockList = stockList.filter(
      item =>
        !['Ngân hàng', 'Bảo hiểm phi nhân thọ', 'Bảo hiểm nhân thọ', 'Công ty Chứng khoán', 'Quỹ mở'].includes(
          item.major,
        ),
    );
    for (const stock of stockList) {
      await fireantPage.sleep(1000);
      try {
        // 2.1. Navigate to stock
        await fireantPage.navigateToStockInfoPage(stock.symbol);

        // 2.2. Click finance tab
        await seleniumHelper.wait({ selector: FireantSelectors.FINANCE_TAB });
        await seleniumHelper.click({ selector: FireantSelectors.FINANCE_TAB });

        // 2.3. Click finance statement button
        await seleniumHelper.wait({ selector: FireantSelectors.FINANCE_STATEMENT_BTN, timeout: 2000 });
        await seleniumHelper.click({ selector: FireantSelectors.FINANCE_STATEMENT_BTN });
        await fireantPage.sleep(1000);

        // 2.4. Calculate Trailing 12M
        const ebitTrailing12M = await fireantPage.calTrailing12MEbit();

        // 2.5. Switch to year data
        await seleniumHelper.wait({ selector: FireantSelectors.CHANGE_PERIOD_SELECT, timeout: 2000 });
        await seleniumHelper.click({ selector: FireantSelectors.CHANGE_PERIOD_SELECT });
        await seleniumHelper.wait({ selector: FireantSelectors.YEAR_OPTIONS_SELECT, timeout: 2000 });
        await seleniumHelper.click({ selector: FireantSelectors.YEAR_OPTIONS_SELECT });

        // 2.6. Calculate Year ago
        const [ebit1YearAgo, ebit2YearAgo, ebit3YearAgo, ebit4YearAgo, ebit5YearAgo] = await Promise.all([
          fireantPage.calYearsAgo(0),
          fireantPage.calYearsAgo(1),
          fireantPage.calYearsAgo(2),
          fireantPage.calYearsAgo(3),
          fireantPage.calYearsAgo(4),
        ]);

        if (ebitTrailing12M * ebit1YearAgo * ebit2YearAgo * ebit3YearAgo * ebit4YearAgo * ebit5YearAgo > 0) {
          filterdData.push(stock);
        }
      } catch (e) {
        console.log(e);
        continue;
      }
    }

    await fireantPage.sleep(10000);

    // 3. Write result to json file
    fs.writeFileSync(
      `resources/filter-by-ebit-${dayjs().format('YYYYMMDD')}.json`,
      JSON.stringify({ data: filterdData }),
      {
        encoding: 'utf8',
      },
    );
  }
}
