import { Statement } from '../statement';
import { FunctionReducer, OP_IDENTIFIER, StringReducer } from './types';
import { oneArgumentReducersGenerator } from './utils';

export type ArrayJoinParams = {
    parts: Statement<string>[] | Statement<string>;
    separator: string;
};

class JoinStringsReducer extends StringReducer<Statement<string>[]> {
    get [OP_IDENTIFIER](): string {
        return '&';
    }
    reduce = (statements: Statement<string>[]): string => {
        return statements.map((s) => s.compile()).join(this[OP_IDENTIFIER]);
    };
}

class ArrayJoinReducer extends FunctionReducer<ArrayJoinParams> {
    get [OP_IDENTIFIER](): string {
        return 'ARRAYJOIN';
    }
    reduce({ parts, separator }: ArrayJoinParams): string {
        return `ARRAYJOIN(${JSON.stringify(
            Array.isArray(parts) ? parts.map((s) => s.compile()) : parts.compile(),
        )}, "${separator}")`;
    }
}

class ConcatJoinReducer extends FunctionReducer<Statement<string>[]> {
    get [OP_IDENTIFIER](): string {
        return 'CONCATENATE';
    }
    reduce(statements: Statement<string>[]): string {
        return `CONCATENATE(${statements.map((s) => s.compile()).join(', ')})`;
    }
}

class StringValueReducer extends FunctionReducer<string> {
    [OP_IDENTIFIER]: '"';
    reduce(val: string): string {
        return `\"${val}\"`;
    }
}

class NumericValueReducer extends FunctionReducer<number> {
    [OP_IDENTIFIER]: 'number';
    reduce(val: number): string {
        return `${val}`;
    }
}

class FieldReferenceReducer extends FunctionReducer<string> {
    [OP_IDENTIFIER]: '{value}';
    reduce(val: string): string {
        return `{${val}}`;
    }
}
export const concatReducer = new ConcatJoinReducer();
export const arrayJoinReducer = new ArrayJoinReducer();
export const fieldReferenceReducer = new FieldReferenceReducer();
export const numericValueReducer = new NumericValueReducer();
export const stringValueReducer = new StringValueReducer();
export const joinStringsReducer = new JoinStringsReducer();

export type StringAndNumberStatements = {
    statement: Statement<string>;
    number: Statement<number>;
};
export const fieldReducer = new (class implements StringReducer<string> {
    [OP_IDENTIFIER]: '{';
    reduce(val: string): string {
        return val.indexOf(' ') !== -1 ? `{${val}}` : val;
    }
})();

const twoArgumentReducersGenerator =
    (op: string) =>
    ({ statement, number }: StringAndNumberStatements): string =>
        `${op}(${statement.compile()}, ${number.compile()})`;

export const encodeUrlComponentReducer = oneArgumentReducersGenerator('ENCODE_URL_COMPONENT');
export const stingLenReducer = oneArgumentReducersGenerator('LEN');
export const toLowerCaseReducer = oneArgumentReducersGenerator('LOWER');
export const textValueReducer = oneArgumentReducersGenerator('T');
export const trimReducer = oneArgumentReducersGenerator('TRIM');
export const toUpperCaseReducer = oneArgumentReducersGenerator('UPPER');

export class LeftReducer extends FunctionReducer<StringAndNumberStatements> {
    [OP_IDENTIFIER]: 'LEFT';
    reduce = twoArgumentReducersGenerator('LEFT');
}

export class RightReducer extends FunctionReducer<StringAndNumberStatements> {
    [OP_IDENTIFIER]: 'RIGHT';
    reduce = twoArgumentReducersGenerator('RIGHT');
}

export class ReptReducer extends FunctionReducer<StringAndNumberStatements> {
    [OP_IDENTIFIER]: 'REPT';
    reduce = twoArgumentReducersGenerator('REPT');
}

export const leftReducer = new LeftReducer();
export const rightReducer = new RightReducer();
export const repeatReducer = new RightReducer();

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

class FindReducer extends FunctionReducer<FindReducerParams> {
    [OP_IDENTIFIER]: 'FIND';
    reduce = ({ stringToFind, whereToSearch, startFromPosition }: FindReducerParams): string =>
        `FIND(${stringToFind.compile()}, ${whereToSearch.compile()}${
            startFromPosition ? `, ${startFromPosition.compile()}` : ''
        })`;
}
export const findReducer = new FindReducer();

class SearchReducer extends FunctionReducer<FindReducerParams> {
    [OP_IDENTIFIER]: 'SEARCH';
    reduce = ({ stringToFind, whereToSearch, startFromPosition }: FindReducerParams): string =>
        `SEARCH(${stringToFind.compile()}, ${whereToSearch.compile()}${
            startFromPosition ? `, ${startFromPosition.compile()}` : ''
        })`;
}
export const searchReducer = new SearchReducer();

export class MidReducer extends FunctionReducer<MidReducerParams> {
    [OP_IDENTIFIER]: 'MID';
    reduce = ({ string, whereToStart, count }: MidReducerParams): string =>
        `MID(${string.compile()}, ${whereToStart.compile()}, ${count.compile()})`;
}

export const midReducer = new MidReducer();

export class ReplaceReducer extends FunctionReducer<ReplaceReducerParams> {
    [OP_IDENTIFIER]: 'REPLACE';
    reduce = ({ numberOfCharachters, string, replacement, startChar }: ReplaceReducerParams): string =>
        `REPLACE(${string.compile()}, ${startChar.compile()}, ${numberOfCharachters.compile()}, ${replacement.compile()})`;
}

export const replaceReducer = new ReplaceReducer();

export class SubstituteReducer extends FunctionReducer<SubstituteReducerParams> {
    [OP_IDENTIFIER]: 'SUBSTITUTE';
    reduce = ({ newText, string, oldText, index }: SubstituteReducerParams): string =>
        `SUBSTITUTE(${string.compile()}, ${oldText.compile()}, ${newText.compile()}${
            index ? `, ${index.compile()}` : ''
        })`;
}

export const substituteReducer = new SubstituteReducer();
