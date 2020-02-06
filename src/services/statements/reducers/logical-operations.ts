import { Statement } from '../statement';

export type LoginOperationParams = Statement<any>[];
export type IfOperationParams = [Statement<any>, Statement<any>, Statement<any>];

const generateLogicReducer = (op: 'AND' | 'OR' | 'XOR') => (statements: LoginOperationParams) =>
    `${op}(${statements.map(s => s.stringValue()).join(', ')})`;

export const ifReducer = ([condition, ifTrue, ifFalse]: [Statement<any>, Statement<any>, Statement<any>]) =>
    `IF(${condition.stringValue()}, ${ifTrue.stringValue()}, ${ifFalse.stringValue()})`;

export const andReducer = generateLogicReducer('AND');
export const orReducer = generateLogicReducer('OR');
export const xorReducer = generateLogicReducer('XOR');
