import { By } from 'selenium-webdriver';

export class DashboardPage {
  public static readonly FIND_OPPORTUNITIES_BTN = By.xpath(`//*[@id="root"]/div/div[1]/div[1]/button[2]/span`);
}
