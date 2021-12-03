import { OP_IDENTIFIER, StringNode, Node } from './types';

export type OperatorArgs<K extends string | number> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    left: Node<string, K>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    right: Node<string, K>;
};

export const LogicalOperators = ['>=', '<=', '<', '>', '=', '!='] as const;
export type LogicalOperator = typeof LogicalOperators[number];

export const NumericOperators = ['+', '-', '*', '/'] as const;
export type NumericOperator = typeof NumericOperators[number];

export type Operator = LogicalOperator | NumericOperator;

export const operatorNodeGenerator = <K extends string | number>(
    op: Operator,
): { new (args: OperatorArgs<K>): StringNode<OperatorArgs<K>> } => {
    return class extends StringNode<OperatorArgs<K>> {
        constructor(args: OperatorArgs<K>) {
            super(args);
            const { left, right } = args;
            this.children = [left, right];
        }
        reduce(): string {
            return `${this.value.left.reduce()} ${op} ${this.value.right.reduce()}`;
        }
        [OP_IDENTIFIER] = op;
    };
};
