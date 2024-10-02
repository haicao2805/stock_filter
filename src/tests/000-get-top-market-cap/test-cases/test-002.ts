import assert from 'assert';
import { ISeleniumContext, Promisable } from '../../../commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import { FireantPage } from '../../../models';
import fs from 'fs';
import dayjs from 'dayjs';
import { DataMarketCap } from './test-001';
import { Workbook } from 'exceljs';

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

    // 2. Write result to excel file
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Top market cap');

    worksheet.columns = [
      { header: 'symbol', key: 'symbol', width: 10 },
      { header: 'broker', key: 'broker', width: 10 },
      { header: 'major', key: 'major', width: 10 },
      { header: 'marketCap', key: 'marketCap', width: 10 },
      { header: 'eps', key: 'eps', width: 10 },
      { header: 'pe', key: 'pe', width: 10 },
      { header: 'pb', key: 'pb', width: 10 },
      { header: 'ps', key: 'ps', width: 10 },
      { header: 'roa', key: 'roa', width: 10 },
      { header: 'roe', key: 'roe', width: 10 },
    ];

    topMaketCapData.data.forEach(stockData => {
      const { symbol, broker, major, marketCap, eps, pe, pb, ps, roa, roe } = stockData;
      const row = { symbol, broker, major, marketCap, eps, pe, pb, ps, roa, roe };

      worksheet.addRow(row);
    });

    workbook.xlsx
      .writeFile(`resources/top-market-cap-${dayjs().format('YYYYMMDD')}.excel`)
      .then(() => {
        console.log('File created successfully');
      })
      .catch(error => {
        console.log('Error creating file:', error);
      });
  }
}
