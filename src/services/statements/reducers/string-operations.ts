import { FunctionNode, NumberNode, OP_IDENTIFIER, StringNode, TextNode } from './types';
import { oneArgumentNodeGenerator } from './utils';

export type ArrayJoinParams = {
    parts: StringNode<string>[] | StringNode<string>;
    separator: string;
};

export class JoinStringsNode extends StringNode<StringNode<string>[]> {
    constructor(value: StringNode<string>[]) {
        super(value);
        this.children.push(...value);
    }
    get [OP_IDENTIFIER](): string {
        return '&';
    }
    reduce = (): string => {
        return this.value.map((s) => s.reduce()).join(` ${this[OP_IDENTIFIER]} `);
    };
}

export class ArrayJoinNode extends FunctionNode<ArrayJoinParams> {
    constructor(value: ArrayJoinParams) {
        super(value);
        this.children.push(new TextNode(value.separator));
        if (Array.isArray(value.parts)) {
            this.children.push(...value.parts);
        } else {
            this.children.push(value.parts);
        }
    }
    get [OP_IDENTIFIER](): string {
        return 'ARRAYJOIN';
    }
    reduce(): string {
        const { parts, separator } = this.value;
        return `ARRAYJOIN(${JSON.stringify(
            Array.isArray(parts) ? parts.map((s) => s.reduce()) : parts.reduce(),
        )}, "${separator}")`;
    }
}

export class ConcatJoinNode extends FunctionNode<StringNode<string>[]> {
    constructor(value: StringNode<string>[]) {
        super(value);
        this.children.push(...value);
    }
    get [OP_IDENTIFIER](): string {
        return 'CONCATENATE';
    }
    reduce(): string {
        return `CONCATENATE(${this.value.map((s) => s.reduce()).join(', ')})`;
    }
}

export type StringAndNumberStatements = {
    statement: StringNode<string>;
    number: NumberNode;
};

export class FieldNode extends StringNode<string> {
    constructor(value: string) {
        super(value);
        this.children.push(new TextNode(value));
    }
    [OP_IDENTIFIER]: '{';
    reduce(): string {
        return this.value.indexOf(' ') !== -1 ? `{${this.value}}` : this.value;
    }
}

function twoArgumentNodesGenerator(op: string) {
    return function (this: FunctionNode<StringAndNumberStatements>): string {
        return `${op}(${this.value.statement.reduce()}, ${this.value.number.reduce()})`;
    };
}

export const EncodeUrlComponentNode = oneArgumentNodeGenerator('ENCODE_URL_COMPONENT');
export const LenNode = oneArgumentNodeGenerator('LEN');
export const ToLowerCaseNode = oneArgumentNodeGenerator('LOWER');
export const TextValueNode = oneArgumentNodeGenerator('T');
export const TrimNode = oneArgumentNodeGenerator('TRIM');
export const ToUpperCaseNode = oneArgumentNodeGenerator('UPPER');

export class LeftFunctionNode extends FunctionNode<StringAndNumberStatements> {
    constructor(value: StringAndNumberStatements) {
        super(value);
        const { number, statement } = value;
        this.children.push(...[number, statement]);
    }
    [OP_IDENTIFIER]: 'LEFT';
    reduce: () => string = twoArgumentNodesGenerator('LEFT').bind(this);
}

export class RightFunctionNode extends FunctionNode<StringAndNumberStatements> {
    constructor(value: StringAndNumberStatements) {
        super(value);
        const { number, statement } = value;
        this.children.push(...[number, statement]);
    }
    [OP_IDENTIFIER]: 'RIGHT';
    reduce: () => string = twoArgumentNodesGenerator('RIGHT').bind(this);
}

export class ReptFunctionNode extends FunctionNode<StringAndNumberStatements> {
    constructor(value: StringAndNumberStatements) {
        super(value);
        const { number, statement } = value;
        this.children.push(...[number, statement]);
    }
    [OP_IDENTIFIER]: 'REPT';
    reduce: () => string = twoArgumentNodesGenerator('REPT').bind(this);
}

export type FindNodeParams = {
    stringToFind: TextNode;
    whereToSearch: TextNode;
    startFromPosition?: NumberNode;
};

export type MidNodeParams = {
    string: TextNode;
    whereToStart: NumberNode;
    count: NumberNode;
};

export type ReplaceNodeParams = {
    string: TextNode;
    startChar: NumberNode;
    numberOfCharachters: NumberNode;
    replacement: TextNode;
};

export type SubstituteNodeParams = {
    string: TextNode;
    oldText: TextNode;
    newText: TextNode;
    index?: NumberNode;
};

export class FindNode extends FunctionNode<FindNodeParams> {
    constructor(params: FindNodeParams) {
        super(params);
        const { stringToFind, whereToSearch, startFromPosition } = params;
        this.children.push(...[stringToFind, whereToSearch]);
        if (startFromPosition) {
            this.children.push(startFromPosition);
        }
    }
    [OP_IDENTIFIER]: 'FIND';
    reduce = (): string =>
        `FIND(${this.value.stringToFind.reduce()}, ${this.value.whereToSearch.reduce()}${
            this.value.startFromPosition ? `, ${this.value.startFromPosition.reduce()}` : ''
        })`;
}
export class SearchNode extends FunctionNode<FindNodeParams> {
    constructor(params: FindNodeParams) {
        super(params);
        const { stringToFind, whereToSearch, startFromPosition } = params;
        this.children.push(...[stringToFind, whereToSearch]);
        if (startFromPosition) {
            this.children.push(startFromPosition);
        }
    }
    [OP_IDENTIFIER]: 'SEARCH';
    reduce = (): string =>
        `SEARCH(${this.value.stringToFind.reduce()}, ${this.value.whereToSearch.reduce()}${
            this.value.startFromPosition ? `, ${this.value.startFromPosition.reduce()}` : ''
        })`;
}

export class MidNode extends FunctionNode<MidNodeParams> {
    constructor(params: MidNodeParams) {
        super(params);
        const { count, string, whereToStart } = params;
        this.children.push(...[count, string, whereToStart]);
    }
    [OP_IDENTIFIER]: 'MID';
    reduce = (): string =>
        `MID(${this.value.string.reduce()}, ${this.value.whereToStart.reduce()}, ${this.value.count.reduce()})`;
}

export class ReplaceNode extends FunctionNode<ReplaceNodeParams> {
    constructor(params: ReplaceNodeParams) {
        super(params);
        const { replacement, string, numberOfCharachters, startChar } = params;
        this.children.push(...[replacement, string, numberOfCharachters, startChar]);
    }
    [OP_IDENTIFIER]: 'REPLACE';
    reduce = (): string =>
        `REPLACE(${this.value.string.reduce()}, ${this.value.startChar.reduce()}, ${this.value.numberOfCharachters.reduce()}, ${this.value.replacement.reduce()})`;
}

export class SubstituteNode extends FunctionNode<SubstituteNodeParams> {
    constructor(params: SubstituteNodeParams) {
        super(params);
        const { newText, string, oldText, index } = params;
        this.children.push(...[newText, string, oldText]);
        if (index) {
            this.children.push(index);
        }
    }
    [OP_IDENTIFIER]: 'SUBSTITUTE';
    reduce = (): string =>
        `SUBSTITUTE(${this.value.string.reduce()}, ${this.value.oldText.reduce()}, ${this.value.newText.reduce()}${
            this.value.index ? `, ${this.value.index.reduce()}` : ''
        })`;
}
