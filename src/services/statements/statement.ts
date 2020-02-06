export class Statement<K> {
    constructor(private value: K, private reducer: (args: K) => string) {}
    getValue() {
        this.value;
    }
    setValue(value: K) {
        this.value = value;
    }
    stringValue() {
        if (!this.value) {
            return '';
        }
        return this.reducer(this.value);
    }
}
