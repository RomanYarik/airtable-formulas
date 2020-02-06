import { Statement } from '../statement';

export const joinStringsReducer = (statements: Statement<string>[]): string => {
    return statements.map(s => s.stringValue()).join(' & ');
};

export type ArrayJoinParams = {
    parts: Statement<string>[] | Statement<string>;
    separator: string;
};

export const arrayJoinReducer = ({ parts, separator }: ArrayJoinParams): string =>
    `ARRAYJOIN(${JSON.stringify(
        Array.isArray(parts) ? parts.map(s => s.stringValue()) : parts.stringValue(),
    )}, "${separator}")`;

export const concatReducer = (statements: Statement<string>[]): string =>
    `CONCATENATE(${statements.map(s => s.stringValue()).join(', ')})`;

export const stringValueReducer = (val: string): string => `\"${val}\"`;

export const numberValueReducer = (val: number): string => `${val}`;

export type StringAndNumberStatements = {
    statement: Statement<string>;
    number: Statement<number>;
};
export const fieldReducer = (val: string): string => (val.indexOf(' ') !== -1 ? `{${val}}` : val);

const oneArgumentReducersGenerator = (op: string) => (statement: Statement<string>): string =>
    `${op}(${statement.stringValue()})`;

const twoArgumentReducersGenerator = (op: string) => ({ statement, number }: StringAndNumberStatements): string =>
    `${op}(${statement.stringValue()}, ${number.stringValue()})`;

export const encodeUrlComponentReducer = oneArgumentReducersGenerator('ENCODE_URL_COMPONENT');
export const stingLenReducer = oneArgumentReducersGenerator('LEN');
export const toLowerCaseReducer = oneArgumentReducersGenerator('LOWER');
export const textValueReducer = oneArgumentReducersGenerator('T');
export const trimReducer = oneArgumentReducersGenerator('TRIM');
export const toUpperCaseReducer = oneArgumentReducersGenerator('UPPER');

export const leftReducer = twoArgumentReducersGenerator('LEFT');
export const rightReducer = twoArgumentReducersGenerator('RIGHT');
export const repeatReducer = twoArgumentReducersGenerator('REPT');

export type FindReducerParams = {
    stringToFind: Statement<string>;
    whereToSearch: Statement<string>;
    startFromPosition?: Statement<number>;
};

export type MidReducerParams = {
    string: Statement<string>;
    whereToStart: Statement<number>;
    count: Statement<number>;
};

export type ReplaceReducerParams = {
    string: Statement<string>;
    startChar: Statement<number>;
    numberOfCharachters: Statement<number>;
    replacement: Statement<string>;
};

export type SubstituteReducerParams = {
    string: Statement<string>;
    oldText: Statement<string>;
    newText: Statement<string>;
    index?: Statement<number>;
};

export const findReducer = ({ stringToFind, whereToSearch, startFromPosition }: FindReducerParams): string =>
    `FIND(${stringToFind.stringValue()}, ${whereToSearch.stringValue()}${
        startFromPosition ? `, ${startFromPosition.stringValue()}` : ''
    })`;

export const searchReducer = ({ stringToFind, whereToSearch, startFromPosition }: FindReducerParams): string =>
    `SEARCH(${stringToFind.stringValue()}, ${whereToSearch.stringValue()}${
        startFromPosition ? `, ${startFromPosition.stringValue()}` : ''
    })`;

export const midReducer = ({ string, whereToStart, count }: MidReducerParams): string =>
    `MID(${string.stringValue()}, ${whereToStart.stringValue()}, ${count.stringValue()})`;

export const replaceReducer = ({ numberOfCharachters, string, replacement, startChar }: ReplaceReducerParams): string =>
    `REPLACE(${string.stringValue()}, ${startChar.stringValue()}, ${numberOfCharachters.stringValue()}, ${replacement.stringValue()})`;

export const substituteReducer = ({ newText, string, oldText, index }: SubstituteReducerParams): string =>
    `SUBSTITUTE(${string.stringValue()}, ${oldText.stringValue()}, ${newText.stringValue()}${
        index ? `, ${index.stringValue()}` : ''
    })`;
