import { BasePage } from '.';
import { SeleniumHelper } from '../helper';
import { FireantSelectors } from '../commons';

export class FireantPage extends BasePage {
  constructor(opts: { seleniumHelper: SeleniumHelper }) {
    const { seleniumHelper } = opts;
    super({ seleniumHelper });
  }

  // ----------------------------------------------------------------------------------------------------
  async navigateToDashboardPage() {
    await this.seleniumHelper.webDriver.get('https://fireant.vn/dashboard');
  }

  // ----------------------------------------------------------------------------------------------------
  async navigateToStockInfoPage(stock: string) {
    await this.seleniumHelper.webDriver.get(`https://fireant.vn/ma-chung-khoan/${stock}`);
  }

  // ----------------------------------------------------------------------------------------------------
  async clickFindOpportunitiesBtn() {
    await this.seleniumHelper.click({ selector: FireantSelectors.FIND_OPPORTUNITIES_BTN });
  }

  // ----------------------------------------------------------------------------------------------------
  async clickFilterTab() {
    await this.seleniumHelper.click({ selector: FireantSelectors.FILTER_TAB });
  }

  // ----------------------------------------------------------------------------------------------------
  async closePopupsIfExistDashboardPage() {
    const isPopupNotiDisplayed = await this.seleniumHelper.isDisplayed({
      selector: FireantSelectors.POPUP_NOTI_AT_DASHBOARD_PAGE,
    });
    if (isPopupNotiDisplayed) {
      await this.refresh();
      await this.sleep(500);
    }

    // 3. Reset if popup noti exist
    const isPopupAiDisplayed = await this.seleniumHelper.isDisplayed({
      selector: FireantSelectors.POPUP_AI_AT_DASHBOARD_PAGE,
    });
    if (isPopupAiDisplayed) {
      await this.refresh();
      await this.sleep(500);
    }
  }

  // ----------------------------------------------------------------------------------------------------
  async closePopupsIfExistStockInfoPage() {
    const isPopupNotiDisplayed = await this.seleniumHelper.isDisplayed({
      selector: FireantSelectors.POPUP_NOTI_AT_STOCK_INFO_PAGE,
    });
    if (isPopupNotiDisplayed) {
      await this.refresh();
      await this.sleep(500);
    }
  }

  // ----------------------------------------------------------------------------------------------------
  async calTrailing12MEbit() {
    let sumOfBeforeTaxesIncome = 0;
    let sumOfInterest = 0;
    for (let i = 0; i <= 3; i++) {
      const beforeTaxesIncome = (
        await this.seleniumHelper.getTextField({
          selector: FireantSelectors.getBeforeTaxesIncome(i),
          timeout: 2000,
        })
      ).replace(/,/g, '');
      sumOfBeforeTaxesIncome += Number(beforeTaxesIncome);

      const interest = (
        await this.seleniumHelper.getTextField({ selector: FireantSelectors.getInterest(i), timeout: 2000 })
      ).replace(/,/g, '');
      sumOfInterest += Number(interest);
    }

    return sumOfBeforeTaxesIncome + sumOfInterest;
  }

  // ----------------------------------------------------------------------------------------------------
  async calYearsAgo(diff: number) {
    const beforeTaxesIncome = (
      await this.seleniumHelper.getTextField({
        selector: FireantSelectors.getBeforeTaxesIncome(diff),
        timeout: 2000,
      })
    ).replace(/,/g, '');

    const interest = (
      await this.seleniumHelper.getTextField({ selector: FireantSelectors.getInterest(diff), timeout: 2000 })
    ).replace(/,/g, '');

    return Number(beforeTaxesIncome) + Number(interest);
  }
}
