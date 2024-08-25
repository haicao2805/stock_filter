import { BaseElements } from '../commons';
import { ApplicationLogger, LoggerFactory, SeleniumHelper } from '../helper';
import { By } from 'selenium-webdriver';

export interface IPageOptions {
  scope?: string;
  seleniumHelper: SeleniumHelper;
}

export abstract class BasePage {
  seleniumHelper: SeleniumHelper;
  protected logger: ApplicationLogger;

  constructor(opts: IPageOptions) {
    this.seleniumHelper = opts.seleniumHelper;
    this.logger = LoggerFactory.getLogger([opts?.scope ?? BasePage.name]);
  }

  async sleep(milliseconds: number) {
    if (milliseconds <= 0) {
      return;
    }

    await this.seleniumHelper.webDriver.sleep(milliseconds);
  }

  private async navigatePane(opts: { selector: By }) {
    await this.seleniumHelper.click(opts);
  }

  async navigateToCreate() {
    await this.navigatePane({ selector: BaseElements.BUTTON_CREATE });
  }

  async navigateToDelete() {
    await this.navigatePane({ selector: BaseElements.BUTTON_DELETE });
  }

  async navigateToDuplicate() {
    await this.navigatePane({ selector: BaseElements.BUTTON_DUPLICATE });
  }

  async resetColumnOrder() {
    const resetButton = await this.seleniumHelper.click({ selector: BaseElements.RESET_COLUMN_BTN });

    const resetOrderButton = await this.seleniumHelper.find({ selector: BaseElements.RESET_ORDER_BTN });
    const showAllButton = await this.seleniumHelper.find({ selector: BaseElements.SHOW_ALL_BTN });
    const isShowAllButtonDisplayed = (await showAllButton?.isEnabled()) ?? false;

    if (isShowAllButtonDisplayed) {
      await this.seleniumHelper.click({ selector: BaseElements.SHOW_ALL_BTN });
      await this.seleniumHelper.click({ selector: BaseElements.RESET_ORDER_BTN });
    } else {
      await this.seleniumHelper.click({ selector: BaseElements.RESET_ORDER_BTN });
    }
  }

  async refresh() {
    await this.seleniumHelper.webDriver.navigate().refresh();
  }
}
