import { Statement } from '../statement';

export type OperatorArgs = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    left: Statement<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    right: Statement<any>;
};

export type LogicalOperator = '>=' | '<=' | '<' | '>' | '=' | '!=';

export type NumericOperator = '+' | '-' | '*' | '/';

export type Operator = LogicalOperator | NumericOperator;

function getStatementValue<K>(statement: Statement<K>): string {
    const statementValue = statement.getValue();
    if (typeof statementValue === 'object') {
        return `(${statement.stringValue()})`;
    }
    return statement.stringValue();
}

export const operatorReducer = (op: Operator) => ({ left, right }: OperatorArgs): string =>
    `${getStatementValue(left)} ${op} ${getStatementValue(right)}`;
