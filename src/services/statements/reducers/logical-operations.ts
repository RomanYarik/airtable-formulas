import { Statement } from '../statement';
import { oneArgumentReducersGenerator } from './string-operations';

export type LoginOperationParams<T extends any = any> = Statement<T>[];
export type IfOperationParams<A, B, C> = [Statement<A>, Statement<B>, Statement<C>];

const generateLogicReducer = (op: 'AND' | 'OR' | 'XOR') => (statements: LoginOperationParams) =>
    `${op}(${statements.map((s) => s.stringValue()).join(', ')})`;

export const ifReducer = <A, B, C>([condition, ifTrue, ifFalse]:
    | Statement<A>[]
    | [Statement<A>, Statement<B>, Statement<C>]
    | readonly [Statement<A>, Statement<B>, Statement<C>]) =>
    `IF(${condition.stringValue()}, ${ifTrue.stringValue()}, ${ifFalse.stringValue()})`;

type StatementCaseType<K, U> = [condition: Statement<K>, result: Statement<U>];

export const switchReducer = <K, U>({
    pattern,
    cases,
    defaultValue,
}: {
    pattern: Statement<string>;
    cases: StatementCaseType<K, U>;
    defaultValue?: Statement<string> | Statement<Statement<string>>;
}) =>
    `SWITCH(${pattern.stringValue()}, ${[...cases, defaultValue]
        .map((s) => s?.stringValue())
        .filter(Boolean)
        .join(', ')})`;

export const andReducer = generateLogicReducer('AND');
export const orReducer = generateLogicReducer('OR');
export const xorReducer = generateLogicReducer('XOR');
export const blankReducer = () => 'BLANK()';
export const errrorReducer = () => 'ERROR()';
export const trueReducer = () => 'TRUE()';
export const falseReducer = () => 'FALSE()';
export const isErrorReducer = oneArgumentReducersGenerator('ISERROR');
export const notReducer = oneArgumentReducersGenerator('NOT');
