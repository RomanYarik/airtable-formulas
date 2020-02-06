import { Statement } from '../statement';

export const joinStringsReducer = (statements: Statement<string>[]) => {
    return statements.map(s => s.stringValue()).join(' & ');
};

export type ArrayJoinParams = {
    parts: Statement<string>[] | Statement<string>;
    separator: string;
};

export const arrayJoinReducer = ({ parts, separator }: ArrayJoinParams) =>
    `ARRAYJOIN(${JSON.stringify(
        Array.isArray(parts) ? parts.map(s => s.stringValue()) : parts.stringValue(),
    )}, "${separator}")`;

export const concatReducer = (statements: Statement<string>[]) =>
    `CONCATENATE(${statements.map(s => s.stringValue()).join(', ')})`;

export const stringValueReducer = (val: string) => `\"${val}\"`;

export const numberValueReducer = (val: number) => `${val}`;

export type StringAndNumberStatements = {
    statement: Statement<string>;
    number: Statement<number>;
};
export const fieldReducer = (val: string) => (val.indexOf(' ') !== -1 ? `{${val}}` : val);

const oneArgumentReducersGenerator = (op: string) => (statement: Statement<string>) =>
    `${op}(${statement.stringValue()})`;

const twoArgumentReducersGenerator = (op: string) => ({ statement, number }: StringAndNumberStatements) =>
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
export const findReducer = ({ stringToFind, whereToSearch, startFromPosition }: FindReducerParams) =>
    `FIND(${stringToFind.stringValue()}, ${whereToSearch.stringValue()}${
        startFromPosition ? `, ${startFromPosition.stringValue()}` : ''
    })`;
