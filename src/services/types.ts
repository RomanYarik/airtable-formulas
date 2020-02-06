export enum Operations {
  JOIN_STRINGS
}

export interface Statement<T> {
  getValue(): T;
  setValue(value: T): void;
  operation: Operations;
  stringValue(): string;
}
