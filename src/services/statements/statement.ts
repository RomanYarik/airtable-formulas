import { Reducer } from './reducers/types';

export type ParseType<K> = K extends string ? string : K extends number ? number : K;

export type InferArgs<K> = K extends (args: infer U) => string ? U : K;

export class Statement<K, REDUCE_VALUE = string> {
    constructor(private reducer: Reducer<REDUCE_VALUE, K>, private value: ParseType<K>) {}

    getValue(): ParseType<K> {
        return this.value;
    }
    setValue(value: ParseType<K>): void {
        this.value = value;
    }
    compile(): REDUCE_VALUE {
        if (!this.value) {
            throw new Error('Cannot compile a statement without a value');
        }
        return this.reducer.reduce(this.value as K);
    }
}
