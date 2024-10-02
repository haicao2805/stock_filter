import { DIContainerHelper, SeleniumHelper } from '../../helper';
import { AnyType } from './common';

export interface ITestContext<R extends object> {
  scope: string;

  getRegistry: () => DIContainerHelper<R>;

  bind: <T>(opts: { key: string; value: T }) => void;
  getSync: <E = AnyType>(opts: { key: keyof R }) => E;
}

export interface ISeleniumContext {
  seleniumHelper: SeleniumHelper;
}
