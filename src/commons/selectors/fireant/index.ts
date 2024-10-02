import { By } from 'selenium-webdriver';

export class FireantSelectors {
  // Dashboard page
  public static readonly POPUP_NOTI_AT_DASHBOARD_PAGE = By.xpath(`/html/body/div[2]/div/div[3]/div`);
  public static readonly POPUP_AI_AT_DASHBOARD_PAGE = By.xpath(`/html/body/div[2]/div/div[3]/div`);

  public static readonly FIND_OPPORTUNITIES_BTN = By.xpath(`//*[@id="root"]/div/div[1]/div[1]/button[2]/span`);
  public static readonly FILTER_TAB = By.xpath(`//*[@id="root"]/div/div[2]/div[1]/div/div[1]/div[2]`);
  public static readonly DELETE_SECOND_FILTER_CONDITION_BTN = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[1]/div/div[1]/div[2]/div/div[1]/div/div[2]/div[2]/button`,
  );
  public static readonly FILTER_MARKET_CAP_INP = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[1]/div/div[1]/div[2]/div/div[1]/div/div[2]/div[1]/div/div[1]/div/div[2]/input`,
  );
  public static readonly FILTER_RESULT_FA_TAB = By.xpath(`//*[@id="root"]/div/div[2]/div[10]/div/div[2]/div/button[3]`);
  public static readonly FILTER_RESULT_TABLE = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div`,
  );
  public static readonly FILTER_RESULT_FIRST_ROW = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div/div[1]`,
  );
  public static readonly FILTER_RESULT_THUMB_VERTICAL = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[3]/div`,
  );
  public static getResultTableRowSelector(index: number) {
    return By.xpath(
      `//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div/div[${index}]/div/div`,
    );
  }

  // Stock info page
  public static readonly POPUP_NOTI_AT_STOCK_INFO_PAGE = By.xpath(`//*[@id="radix-:R1m:"]`);
  public static readonly FINANCE_TAB = By.xpath(`//*[@id="__next"]/div[1]/div[3]/main/div/div[3]/div[1]/ul/li[6]`);
  public static readonly FINANCE_STATEMENT_BTN = By.xpath(
    `/html/body/div[3]/div[1]/div[3]/main/div/div[3]/div[2]/div[2]/div/div[1]/div[2]/button`,
  );
  public static readonly CHANGE_PERIOD_SELECT = By.xpath(
    `//*[@id="__next"]/div[1]/div[3]/main/div/div[3]/div[2]/div[2]/table/thead/tr/th[1]/div/div[2]/select`,
  );
  public static readonly YEAR_OPTIONS_SELECT = By.xpath(
    `//*[@id="__next"]/div[1]/div[3]/main/div/div[3]/div[2]/div[2]/table/thead/tr/th[1]/div/div[2]/select/option[2]`,
  );

  public static getBeforeTaxesIncome(diff: number) {
    if (diff < 0 || diff > 4) {
      throw new Error('[FireantSelectors][getBeforeTaxesIncome]: Invalid diff');
    }
    return By.xpath(`//*[@id="__next"]/div[1]/div[3]/main/div/div[3]/div[2]/div[2]/table/tbody/tr[16]/td[${7 - diff}]`);
  }
  public static getInterest(diff: number) {
    if (diff < 0 || diff > 4) {
      throw new Error('[FireantSelectors][getInterest]: Invalid diff');
    }
    return By.xpath(`//*[@id="__next"]/div[1]/div[3]/main/div/div[3]/div[2]/div[2]/table/tbody/tr[8]/td[${7 - diff}]`);
  }
}
