export const OP_IDENTIFIER = Symbol('OP_IDENTIFIER');

type NodeConstructor<REDUCE_VALUE, REDUCER_ARGS> = {
    new (): Node<REDUCE_VALUE, REDUCER_ARGS>;
};

export abstract class Node<REDUCE_VALUE, ARGS = undefined> {
    protected constructor(protected value: ARGS) {
        this.value = value;
    }
    protected children: Node<REDUCE_VALUE, unknown>[] = [];
    public getChildren(): Node<REDUCE_VALUE, unknown>[] {
        return this.children;
    }
    public getValue(): ARGS {
        if (!this.value) {
            throw new Error('value was not provided');
        }
        return this.value;
    }
    public abstract [OP_IDENTIFIER]: string;
    public kind(): string {
        return this[OP_IDENTIFIER];
    }
    public abstract reduce(): REDUCE_VALUE;
}

export abstract class StringNode<REDUCER_ARGS> extends Node<string, REDUCER_ARGS> {}

export class TextNode extends Node<string, string> {
    constructor(value: string) {
        super(value);
    }
    [OP_IDENTIFIER]: 'TextNode';
    kind(): string {
        return 'TextNode';
    }
    reduce(): string {
        return `"${this.value}"`;
    }
}

export class NumberNode extends Node<string, number> {
    constructor(value: number) {
        super(value);
    }
    [OP_IDENTIFIER]: 'NumberNode';
    kind(): string {
        return 'NumberNode';
    }
    reduce(): string {
        return '' + this.value;
    }
}

export abstract class FunctionNode<REDUCER_ARGS> extends StringNode<REDUCER_ARGS> {
    public get withBrackets(): boolean {
        return true;
    }
}
