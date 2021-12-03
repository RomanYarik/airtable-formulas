import { OP_IDENTIFIER, StringNode } from './types';

type OneArgumentNode = {
    new (args: StringNode<string>): StringNode<StringNode<string>>;
};

export const oneArgumentNodeGenerator: (command: string) => OneArgumentNode = (command: string): OneArgumentNode =>
    class extends StringNode<StringNode<string>> {
        constructor(value: StringNode<string>) {
            super(value);
            this.children.push(value);
        }
        [OP_IDENTIFIER] = command;
        reduce(): string {
            return `${command}(${this.value.reduce()})`;
        }
    };
