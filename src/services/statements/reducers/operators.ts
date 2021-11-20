import { Statement } from '../statement';
import { OP_IDENTIFIER, StringReducer } from './types';

export type OperatorArgs<K extends string | number> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    left: Statement<K>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    right: Statement<K>;
};

export const LogicalOperators = ['>=', '<=', '<', '>', '=', '!='] as const;
export type LogicalOperator = typeof LogicalOperators[number];

export const NumericOperators = ['+', '-', '*', '/'] as const;
export type NumericOperator = typeof NumericOperators[number];

export type Operator = LogicalOperator | NumericOperator;

function getStatementValue<K>(statement: Statement<K>): string {
    const statementValue = statement.getValue();
    if (typeof statementValue === 'object') {
        return `(${statement.compile()})`;
    }
    return statement.compile();
}

export class OperatorReducer<K extends Operator> extends StringReducer<OperatorArgs<K>> {
    private static running = {} as Record<Operator, OperatorArgs<Operator>>;
}

export const operatorReducerGenerator = <K extends string | number>(op: Operator): StringReducer<OperatorArgs<K>> => {
    return {
        reduce({ left, right }: OperatorArgs<K>): string {
            return `${getStatementValue(left)} ${op} ${getStatementValue(right)}`;
        },
        [OP_IDENTIFIER]: op,
    };
};
