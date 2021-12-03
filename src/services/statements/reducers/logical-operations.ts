import { FunctionNode, OP_IDENTIFIER, StringNode } from './types';
import { oneArgumentNodeGenerator } from './utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LoginOperationParams<T extends any = any> = StringNode<T>[];
export type IfOperationParams<A, B, C> = [StringNode<A>, StringNode<B>, StringNode<C>];

type LogicalOperations = 'AND' | 'OR' | 'XOR';

export interface IfArguments<A, B, C> {
    condition: StringNode<A>;
    true: StringNode<B>;
    false: StringNode<C>;
}

export class IfNode<A, B, C> extends FunctionNode<IfArguments<A, B, C>> {
    constructor(args: IfArguments<A, B, C>) {
        super(args);
        this.children = [args.condition, args.true, args.false];
    }
    [OP_IDENTIFIER] = 'IF';
    reduce = (): string =>
        `IF(${this.value.condition.reduce()}, ${this.value.true.reduce()}, ${this.value.false.reduce()})`;
}

export interface CaseOptions<A, B> {
    value: StringNode<A>;
    condition?: StringNode<B>;
}

export class CaseNode<A, B> extends FunctionNode<CaseOptions<A, B>> {
    [OP_IDENTIFIER] = 'CASE';
    constructor(args: CaseOptions<A, B>) {
        super(args);
        this.children = [];
        if (args.condition) {
            this.children.push(args.condition);
        }
        this.children.push(args.value);
    }

    reduce = (): string =>
        this.value.condition
            ? `${this.value.condition.reduce()}, ${this.value.value.reduce()}`
            : this.value.value.reduce();
}

const generateLogicReducer = (op: LogicalOperations) =>
    function (this: LogicNode): string {
        return `${op}(${this.value.map((s) => s.reduce()).join(', ')})`;
    };

export interface SwitchNodeArguments<K> {
    pattern: StringNode<K>;
    cases: CaseNode<unknown, unknown>[];
}

export class SwitchNode<K> extends FunctionNode<SwitchNodeArguments<K>> {
    [OP_IDENTIFIER] = 'SWITCH';
    constructor(args: SwitchNodeArguments<K>) {
        super(args);
        this.children = [args.pattern, ...args.cases];
    }
    reduce = (): string =>
        `SWITCH(${this.value.pattern.reduce()}, ${this.value.cases.map((s) => s.reduce()).join(', ')})`;
}

abstract class LogicNode extends FunctionNode<LoginOperationParams> {
    private constructor(args: LoginOperationParams) {
        super(args);
    }

    static create(op: LogicalOperations): { new (args: LoginOperationParams): LogicNode } {
        return class extends LogicNode {
            public constructor(args: LoginOperationParams) {
                super(args);
                this.children = args;
            }
            reduce = generateLogicReducer(op);
            [OP_IDENTIFIER] = op;
        };
    }
}

export const AndNode = LogicNode.create('AND');
export const OrNode = LogicNode.create('OR');
export const XorNode = LogicNode.create('XOR');

export const blankReducer = (): string => 'BLANK()';
export const errrorReducer = (): string => 'ERROR()';
export const trueReducer = (): string => 'TRUE()';
export const falseReducer = (): string => 'FALSE()';
export const isErrorReducer = oneArgumentNodeGenerator('ISERROR');
export const notReducer = oneArgumentNodeGenerator('NOT');
