export class Statement<K> {
    constructor(private value: K, private reducer: (args: K) => string) {}
    getValue(): K {
        return this.value;
    }
    setValue(value: K): void {
        this.value = value;
    }
    stringValue(): string {
        if (!this.value) {
            return '';
        }
        return this.reducer(this.value);
    }
}
