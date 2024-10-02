import { By } from 'selenium-webdriver';

export class BaseElements {
  public static readonly BUTTON_CREATE = By.id('toolbar__btn--add');
  public static readonly BUTTON_DELETE = By.id('toolbar__btn--delete');
  public static readonly BUTTON_DUPLICATE = By.id('toolbar__btn--duplicateRow');
  //popup
  public static readonly NO_BUTTON = By.id('basic__modal--false');
  public static readonly YES_BUTTON = By.id('basic__modal--true');
  public static readonly POPUP_TITLE = By.xpath("//div[@id='pc__layout--modal']/div[3]/div/p");
  public static readonly MESSAGE = By.xpath("//div[@id='root']/div/div[2]/div/div");
  public static readonly MAJOR_TITLE = By.xpath('//*[@id="pc__layout"]/div/div[1]/div/div[2]/nav/ol/li[1]/h5');
  public static readonly SUB_TITLE = By.xpath('//*[@id="pc__layout"]/div/div[1]/div/div[2]/nav/ol/li[3]/h5');
  public static readonly HOME_TITLE = By.xpath('//*[@id="pc__layout"]/div/div[1]/div/div[2]/nav/ol/li/h5');
  public static readonly MASTER_DATA_MENU = By.xpath('//*[@id="app__menu"]/div/div/div[2]/div[2]/div[3]');
  public static readonly VENDOR_MENU = By.xpath('//*[@id="app__menu"]/div/div/div[2]/div[3]/div/div/a[1]/div[2]');
  public static readonly CATEGORY_MENU = By.xpath('//*[@id="app__menu"]/div/div/div[2]/div[3]/div/div/a[2]/div[2]');
  public static readonly RESET_COLUMN_BTN = By.id('toolbar__btn--showHideColumns');
  public static readonly RESET_ORDER_BTN = By.xpath('/html/body/div[2]/div[3]/ul/div/button[2]');
  public static readonly SHOW_ALL_BTN = By.xpath('/html/body/div[2]/div[3]/ul/div/button[3]');
}
