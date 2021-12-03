import { Node } from './statements/reducers/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Formula {
    static compileNode<K, S>(node: Node<K, S>): K {
        return node.reduce();
    }
}
