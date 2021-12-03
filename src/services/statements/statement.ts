export type ParseType<K> = K extends string ? string : K extends number ? number : K;

export type InferArgs<K> = K extends (args: infer U) => string ? U : K;
