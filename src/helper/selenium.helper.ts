import { TValueOf } from '../commons';
import { Builder, By, WebDriver, WebElement, until as seleniumUtils } from 'selenium-webdriver';
import { IBrowser } from 'selenium-webdriver/lib/capabilities';

export class SeleniumHelper {
  webDriver: WebDriver;
  private browser: string;

  constructor(opts: { browser: TValueOf<IBrowser> }) {
    this.browser = opts.browser;
  }

  async initialize() {
    this.webDriver = await new Builder().forBrowser(this.browser).build();
  }

  wait(opts: { selector: By; timeout?: number }) {
    const { selector, timeout = 30_000 } = opts;
    return this.webDriver.wait(seleniumUtils.elementsLocated(selector), timeout);
  }

  find(opts: { selector: By; timeout?: number }): Promise<WebElement> {
    return new Promise((resolve, reject) => {
      const { selector, timeout = 30_000 } = opts;

      this.wait({ selector, timeout })
        .then(rs => {
          if (Array.isArray(rs)) {
            resolve(rs?.[0]);
            return;
          }

          resolve(rs);
        })
        .catch(reject);
    });
  }

  async click(opts: { selector: By }) {
    const { selector } = opts;
    const element = await this.find({ selector });
    if (!element) {
      return;
    }

    const isEnabled = await element.isEnabled();
    if (!isEnabled) {
      return;
    }

    await element.click();
  }

  async toggle(opts: { selector: By; state: boolean }) {
    const { selector, state } = opts;
    const element = await this.find({ selector });
    if (!element) {
      return;
    }

    const isEnabled = await element.isEnabled();
    if (!isEnabled) {
      return;
    }

    const isSelected = await element.isSelected();
    if ((isSelected && state) || (!isSelected && !state)) {
      return;
    }

    await element.click();
  }

  async setTextField(opts: { selector: By; value: string | number }) {
    const { selector, value } = opts;
    const element = await this.find({ selector });
    if (!element) {
      return;
    }

    await element.clear();
    await element.sendKeys(value);
  }

  async getTextField(opts: { selector: By; timeout?: number }) {
    const { selector, timeout } = opts;
    const element = await this.find({ selector, timeout });
    if (!element) {
      return '';
    }

    const value = await element.getText();
    return value;
  }

  async isEnabled(opts: { selector: By }) {
    const { selector } = opts;
    const element = await this.find({ selector });
    if (!element) {
      return;
    }

    const isEnabled = await element.isEnabled();
    if (!isEnabled) {
      return false;
    } else {
      return true;
    }
  }

  async isDisplayed(opts: { selector: By; timeout?: number }) {
    const { selector, timeout } = opts;
    const element = await this.find({ selector, timeout });
    if (!element) {
      return;
    }

    const isDisplayed = await element.isDisplayed();
    if (!isDisplayed) {
      return false;
    } else {
      return true;
    }
  }

  async clearField(opts: { selector: By }) {
    const { selector } = opts;
    const element = await this.find({ selector });
    if (!element) {
      return;
    }
    await element.clear();
  }

  async getAttributeValue(opts: { selector: By }) {
    const { selector } = opts;
    const element = await this.find({ selector });
    if (!element) {
      return;
    }
    const text = await element.getAttribute('value');
    return text;
  }
}
