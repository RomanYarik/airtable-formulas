import { Statement } from "./statements/statement";

export class Formula {
  private statement: Statement<any> | undefined;
  setStatement<K extends Statement<any>>(statement: K) {
    this.statement = statement;
  }
  getStringifiedFormula() {
    return this.statement?.stringValue();
  }
}
