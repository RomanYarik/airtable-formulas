import { Statement } from './statements/statement';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Formula<STATEMENT = any> {
    private statement: Statement<STATEMENT> | undefined;
    setStatement<K extends Statement<STATEMENT>>(statement: K): void {
        this.statement = statement;
    }
    build(): string | undefined {
        return this.statement?.compile();
    }
}
