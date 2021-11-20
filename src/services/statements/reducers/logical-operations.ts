import { Statement } from '../statement';
import { FunctionReducer, OP_IDENTIFIER } from './types';
import { oneArgumentReducersGenerator } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoginOperationParams<T extends any = any> = Statement<T>[];
export type IfOperationParams<A, B, C> = [Statement<A>, Statement<B>, Statement<C>];

type LogicalOperations = 'AND' | 'OR' | 'XOR';

const generateLogicReducer =
    (op: LogicalOperations) =>
    (statements: LoginOperationParams): string =>
        `${op}(${statements.map((s) => s.compile()).join(', ')})`;

export const ifReducer = <A, B, C>([condition, ifTrue, ifFalse]:
    | Statement<A>[]
    | [Statement<A>, Statement<B>, Statement<C>]
    | readonly [Statement<A>, Statement<B>, Statement<C>]): string =>
    `IF(${condition.compile()}, ${ifTrue.compile()}, ${ifFalse.compile()})`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const caseReducer = ({ value, condition }: { value: Statement<any>; condition?: Statement<any> }): string =>
    condition ? `${condition.compile()}, ${value.compile()}` : value.compile();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const switchReducer = <K, U>({ pattern, cases }: { pattern: Statement<any>; cases: Statement<any>[] }): string =>
    `SWITCH(${pattern.compile()}, ${cases.map((s) => s.compile()).join(', ')})`;

abstract class LogicReducer extends FunctionReducer<LoginOperationParams> {
    private static running = {} as Record<LogicalOperations, LogicReducer>;

    static create(op: LogicalOperations): LogicReducer {
        if (!LogicReducer.running[op]) {
            LogicReducer.running[op] = new (class extends LogicReducer {
                [OP_IDENTIFIER] = op;
                reduce = generateLogicReducer(op);
            })();
        }
        return LogicReducer.running[op];
    }
}

export const andReducer = LogicReducer.create('AND');
export const orReducer = LogicReducer.create('OR');
export const xorReducer = LogicReducer.create('XOR');

export const blankReducer = (): string => 'BLANK()';
export const errrorReducer = (): string => 'ERROR()';
export const trueReducer = (): string => 'TRUE()';
export const falseReducer = (): string => 'FALSE()';
export const isErrorReducer = oneArgumentReducersGenerator('ISERROR');
export const notReducer = oneArgumentReducersGenerator('NOT');
