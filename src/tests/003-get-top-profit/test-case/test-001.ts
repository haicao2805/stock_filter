import assert from 'assert';
import dayjs from 'dayjs';
import fs from 'fs';
import { set } from 'lodash';
import { Key } from 'selenium-webdriver';
import { FireantSelectors, ISeleniumContext, Promisable } from '../../../commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import { FireantPage } from '../../../models';

export type DataMarketCap = {
  symbol: string;
  broker: string;
  major: string;
  marketCap: string;
  eps: string;
  pe: string;
  pb: string;
  ps: string;
  roa: string;
  roe: string;
};

const convertRawToDataMarketCap = (raw: string[]): DataMarketCap => {
  if (raw.length < 3) {
    console.log(raw);
  }
  return {
    symbol: raw[0],
    broker: raw[1],
    major: raw[2],
    marketCap: raw[3],
    eps: raw[4],
    pe: raw[5],
    pb: raw[6],
    ps: raw[7],
    roa: raw[8],
    roe: raw[9],
  };
};

export class Test001 extends TestCaseHandler<ISeleniumContext, {}> {
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

    // 1. Navigate to dashboard page
    await fireantPage.navigateToDashboardPage();

    // 2. Reset if popups exist
    await fireantPage.closePopupsIfExistDashboardPage();

    // 4. Expand window
    await driver.manage().window().maximize();

    // 5. Click on find oppotinities button
    await fireantPage.clickFindOpportunitiesBtn();

    // 6. Click on filter tab
    await fireantPage.clickFilterTab();

    // 7. Delete filter condition
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.DELETE_FIRST_FILTER_CONDITION_BTN });
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.DELETE_FIRST_FILTER_CONDITION_BTN });
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.DELETE_FIRST_FILTER_CONDITION_BTN });
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.DELETE_FIRST_FILTER_CONDITION_BTN });

    // 8. Click on add filter button
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.ADD_FILTER_BTN });

    // 9. Click on filter 4 quarter profit
    await fireantPage.sleep(500);
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.FILTER_PROFIT_4_QUARTER });
    await fireantPage.sleep(500);
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.CLOSE_FILTER_POPUP_BTN });

    // 10. Change to between filter
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.CHANGE_TYPE_FILTER_BTN });
    await fireantPage.seleniumHelper.webDriver
      .actions({ async: true })
      .move({
        x: 1920 - 1665 - 100,
        y: 148 + 5 + 30 + 30 + 15,
      })
      .click()
      .perform();

    // 11. Input profit min - max
    await fireantPage.seleniumHelper.setTextField({
      selector: FireantSelectors.FILTER_PROFIT_MIN,
      value: '50',
    });
    await fireantPage.seleniumHelper.setTextField({
      selector: FireantSelectors.FILTER_PROFIT_MAX,
      value: '200',
    });

    // 12. Click FA tab
    await fireantPage.seleniumHelper.click({ selector: FireantSelectors.FILTER_RESULT_FA_TAB });
    await fireantPage.sleep(1000);

    // 13. Scroll result table to end and getData
    const windowSize = await driver.manage().window().getSize();
    const map: Record<string, any> = {};
    let currentMapLength = 0;

    while (true) {
      for (let j = 1; j <= 30; j++) {
        try {
          const data = await fireantPage.seleniumHelper.getTextField({
            selector: FireantSelectors.getResultTableRowSelector(j),
            timeout: 1000,
          });

          if (!data || data?.split('\n')?.length < 3) {
            console.log(data);
            break;
          }

          set(map, data.split('\n')[0], convertRawToDataMarketCap(data.split('\n')));
        } catch (e) {
          break;
        }
      }

      driver
        .actions()
        .move({
          x: windowSize.width / 2,
          y: windowSize.height / 2,
        })
        .click()
        .sendKeys(Key.ARROW_DOWN)
        .sendKeys(Key.ARROW_DOWN)
        .sendKeys(Key.ARROW_DOWN)
        .sendKeys(Key.ARROW_DOWN)
        .sendKeys(Key.ARROW_DOWN)
        .sendKeys(Key.ARROW_DOWN)
        .perform();
      await fireantPage.sleep(500);

      if (currentMapLength === Object.keys(map).length) {
        break;
      }
      currentMapLength = Object.keys(map).length;
    }

    await fireantPage.sleep(2000);

    // 11. Write result to json file
    fs.writeFileSync(
      `resources/top-profit-${dayjs().format('YYYYMMDD')}.json`,
      JSON.stringify({ data: Object.values(map) }),
      {
        encoding: 'utf8',
      },
    );
  }
}
