import assert from 'assert';
import dayjs from 'dayjs';
import { Workbook } from 'exceljs';
import fs from 'fs';
import { FireantSelectors, ISeleniumContext, Promisable } from '../../../commons';
import { SeleniumHelper, TestCaseHandler, TTestCaseDecision } from '../../../helper';
import { FireantPage } from '../../../models';
import { DataMarketCap } from './test-001';
import { By } from 'selenium-webdriver';
import { set } from 'lodash';
import { data1, data2, data3 } from './data';

type TData = {
  [symbol: string]: {
    [year: string]: {
      dt: number;
      lng: number;
      lnst: number;
    };
  };
};

export class Test003 extends TestCaseHandler<ISeleniumContext, {}> {
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
    await fireantPage.navigateToStockInfoPage('SCS');

    const topMaketCapData = JSON.parse(
      Buffer.from(fs.readFileSync(`resources/top-profit-${dayjs().format('YYYYMMDD')}.json`)).toString(),
    ) as { data: DataMarketCap[] };

    const finalData: TData[] = [];

    // for (let i = 0; i <= 60; i++) {
    // for (let i = 61; i <= 120; i++) {
    // for (let i = 121; i <= 180; i++) {
    // for (let i = 181; i <= 240; i++) {
    for (let i = 241; i < topMaketCapData.data.length; i++) {
      try {
        const symbol = topMaketCapData.data[i].symbol;
        const major = topMaketCapData.data[i].major;
        console.log(symbol, major);
        if (['Công ty Chứng khoán', 'Bảo hiểm phi nhân thọ', 'Ngân hàng'].includes(major)) {
          continue;
        }
        await fireantPage.navigateToStockInfoPage(symbol);
        await fireantPage.sleep(2000);
        await seleniumHelper.click({ selector: FireantSelectors.FINIANCIAL_BTN });
        await fireantPage.sleep(1000);
        await seleniumHelper.click({ selector: FireantSelectors.FINIANCIAL_STATEMENT_BTN });
        await fireantPage.sleep(1000);
        await seleniumHelper.click({ selector: FireantSelectors.CHANGE_PERIOD_FINIANCIAL_SELECT });
        await seleniumHelper.click({ selector: FireantSelectors.YEAR_OPTIONS_FINIANCIAL_SELECT });
        await fireantPage.sleep(1000);

        const years: number[] = [];
        const dt: number[] = [];
        const lng: number[] = [];
        const lnst: number[] = [];

        // get year
        for (let i = 3; i <= 7; i++) {
          const value = await seleniumHelper.getTextField({
            selector: By.xpath(
              `/html/body/div[3]/div[1]/div[3]/main/div/div[3]/div/div[7]/div/div[3]/div/div[3]/table/thead/tr/th[${i}]`,
            ),
            timeout: 2000,
          });
          years.push(Number(value));
        }

        // get dt
        for (let i = 3; i <= 7; i++) {
          const value = await seleniumHelper.getTextField({
            selector: By.xpath(
              `/html/body/div[3]/div[1]/div[3]/main/div/div[3]/div/div[7]/div/div[3]/div/div[3]/table/tbody/tr[3]/td[${i}]`,
            ),
            timeout: 2000,
          });
          dt.push(Number(value.replace(/,/g, '')));
        }

        // get lng
        for (let i = 3; i <= 7; i++) {
          const value = await seleniumHelper.getTextField({
            selector: By.xpath(
              `/html/body/div[3]/div[1]/div[3]/main/div/div[3]/div/div[7]/div/div[3]/div/div[3]/table/tbody/tr[5]/td[${i}]`,
            ),
            timeout: 2000,
          });
          lng.push(Number(value.replace(/,/g, '')));
        }

        // get lnst
        for (let i = 3; i <= 7; i++) {
          const value = await seleniumHelper.getTextField({
            selector: By.xpath(
              `/html/body/div[3]/div[1]/div[3]/main/div/div[3]/div/div[7]/div/div[3]/div/div[3]/table/tbody/tr[20]/td[${i}]`,
            ),
            timeout: 2000,
          });
          lnst.push(Number(value.replace(/,/g, '')));
        }

        console.log(years, dt, lng, lnst);
        const data: TData = {};
        set(data, symbol, {});
        for (let i = 0; i < years.length; i++) {
          set(data[`${symbol}`], years[i], { dt: dt[i], lng: lng[i], lnst: lnst[i] });
        }
        finalData.push(data);

        await fireantPage.sleep(2000);
      } catch (e) {
        continue;
      }
    }

    // Define fixed years range
    const fixedYears = [2020, 2021, 2022, 2023, 2024];

    // Function to generate an Excel file for a specific financial metric
    async function createExcelFile(metric: 'dt' | 'lng' | 'lnst', filename: string) {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(`Financial ${metric.toUpperCase()}`);

      // Create headers: Symbol, 2020, 2021, 2022, 2023, 2024
      const headers = ['Symbol', ...fixedYears.map(year => `${year}`)];
      worksheet.addRow(headers).font = { bold: true };

      // Populate data
      finalData.forEach((entry: any) => {
        const symbol = Object.keys(entry)[0];
        const yearData = entry[symbol];

        // Initialize row data with 'Symbol' first
        const rowData: (string | number | null)[] = [symbol];

        // Fill financial data, leaving empty if missing
        fixedYears.forEach(year => {
          const financials = yearData[year] || {};
          rowData.push(financials[metric] ?? null);
        });

        worksheet.addRow(rowData);
      });

      // Adjust column width for better readability
      worksheet.columns.forEach(col => {
        col.width = 15;
      });

      // Save the Excel file
      await workbook.xlsx.writeFile(filename);
      console.log(`Excel file saved: ${filename}`);
    }

    // Define file paths
    const timestamp = dayjs().format('YYYYMMDDHHmmss');
    const filePaths = {
      dt: `resources/financial-data-DT-${timestamp}.xlsx`,
      lng: `resources/financial-data-LNG-${timestamp}.xlsx`,
      lnst: `resources/financial-data-LNST-${timestamp}.xlsx`,
    };

    // Generate and save files
    Promise.all([
      createExcelFile('dt', filePaths.dt),
      createExcelFile('lng', filePaths.lng),
      createExcelFile('lnst', filePaths.lnst),
    ]).then(() => console.log('All Excel files generated successfully.'));
  }
}
