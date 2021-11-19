export class Statement<K extends any = any, U = K extends string ? string : K> {
    constructor(private value: U, private reducer: (args: U) => string) {}
    getValue(): U {
        return this.value;
    }
    setValue(value: U): void {
        this.value = value;
    }
    stringValue(): string {
        if (!this.value) {
            return '';
        }
        return this.reducer(this.value);
    }
}
