import { By } from 'selenium-webdriver';

export class FireantSelectors {
  public static readonly FIND_OPPORTUNITIES_BTN = By.xpath(`//*[@id="root"]/div/div[1]/div[1]/button[2]/span`);
  public static readonly POPUP_NOTI_CLOSE_BTN = By.xpath(`/html/body/div[2]/div/div[3]/div/div[1]/button`);
  public static readonly POPUP_AI_CLOSE_BTN = By.xpath(`/html/body/div[2]/div/div[3]/div/div[1]/button`);
  public static readonly FILTER_TAB = By.xpath(`//*[@id="root"]/div/div[2]/div[1]/div/div[1]/div[2]`);
  public static readonly DELETE_SECOND_FILTER_CONDITION_BTN = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[1]/div/div[1]/div[2]/div/div[1]/div/div[2]/div[2]/button`,
  );

  public static readonly FILTER_MARKET_CAP_INP = By.xpath(
    `//*[@id="root"]/div/div[2]/div[10]/div/div[1]/div/div[1]/div[2]/div/div[1]/div/div[2]/div[1]/div/div[1]/div/div[2]/input`,
  );

  public static readonly FILTER_RESULT_FA_TAB = By.xpath(`//*[@id="root"]/div/div[2]/div[10]/div/div[2]/div/button[3]`);
  public static readonly FILTER_RESULT_TABLE = By.xpath(`//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div`);
  //*[@id="root"]/div/div[2]/div[10]/div/div[3]
  //*[@id="root"]/div/div[2]/div[10]/div/div[3]/div
  //*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div
  public static readonly FILTER_RESULT_FIRST_ROW = By.xpath(`//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div/div[1]`)
  public static readonly FILTER_RESULT_THUMB_VERTICAL = By.xpath(`//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[3]/div`);

  public static getResultTableRowSelector(index: number) {
    return By.xpath(
      `//*[@id="root"]/div/div[2]/div[10]/div/div[3]/div/div[2]/div/div/div[1]/div/div[${index}]/div/div`,
    );
  }
}
