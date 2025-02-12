import { FireantSelectors, ISeleniumContext, Promisable } from '../../../commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import assert from 'assert';
import { FireantPage } from '../../../models';
import { By, Key } from 'selenium-webdriver';
import { set } from 'lodash';
import fs from 'fs';
import dayjs from 'dayjs';
import isFinite from 'lodash/isFinite';
import { Workbook } from 'exceljs';
import { stocks } from './data';

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

    const finalData: { stock: string; dividend: number }[] = [];

    await fireantPage.navigateToStockInfoPage('SCS');
    await fireantPage.closePopupsIfExistStockInfoPage();

    // 874
    const selectedYear = 2024;
    // for (let i = 601; i <= 700; i++) {
    // for (let i = 701; i <= 800; i++) {
      for (let i = 801; i <= 874; i++) {
      try {
        const stock = stocks[i];
        console.log(i, stock);
        await driver.manage().window().maximize();

        await fireantPage.navigateToStockInfoPage(stock);
        await fireantPage.sleep(1000);
        await seleniumHelper.click({ selector: FireantSelectors.DIVIDEND_BTN });
        await fireantPage.sleep(1000);

        const data: string[] = [];
        let index = 1;
        while (true) {
          try {
            const row = await fireantPage.seleniumHelper.getTextField({
              selector: By.xpath(
                `//*[@id="radix-:R576hj6:-content-dividend"]/div/div[2]/div/div[2]/div/div/div[1]/div[${index}]/div`,
              ),
              timeout: 1000,
            });

            const [dateStr, dividendInfoStr, _finalDateStc] = row.split('\n');
            const year = dayjs(dateStr).year();

            if (year < selectedYear) {
              break;
            }
            index++;

            if (dividendInfoStr.includes('tiền')) {
              data.push(dividendInfoStr);
            }
          } catch (e) {
            break;
          }
        }

        //['Cổ tức đợt 1/2024 bằng tiền, tỷ lệ 3.000đ/CP']
        const formatedData = data.map(item => {
          const dividendStr = item.split('tỷ lệ ')?.[1].replace('đ/CP', '').replace('.', '');
          return isFinite(+dividendStr) ? +dividendStr : 0;
        });

        const dividend = formatedData.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);

        finalData.push({ stock, dividend });
      } catch (e) {
        continue;
      }
    }

    // --------------------------------------------------
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Top market cap');

    worksheet.columns = [
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Dividend', key: 'dividend', width: 10 },
    ];

    finalData.forEach(item => {
      const { stock, dividend } = item;
      const row = { stock, dividend };

      worksheet.addRow(row);
    });

    workbook.xlsx
      .writeFile(`resources/dividend-${selectedYear}-${dayjs().format('YYYYMMDD-HHmm')}.xlsx`)
      .then(() => {
        console.log('File created successfully');
      })
      .catch(error => {
        console.log('Error creating file:', error);
      });
  }
}
