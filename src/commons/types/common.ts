export type TValueOf<T> = T[keyof T];
export type AnyType = any;
export type AnyObject = Record<string | symbol | number, any>;
export type Promisable<T> = T | Promise<T>;
