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
  async clickFindOpportunitiesBtn() {
    await this.seleniumHelper.click({ selector: FireantSelectors.FIND_OPPORTUNITIES_BTN });
  }

  // ----------------------------------------------------------------------------------------------------
  async clickFilterTab() {
    await this.seleniumHelper.click({ selector: FireantSelectors.FILTER_TAB });
  }
}
