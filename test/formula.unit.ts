import { expect } from 'chai';
import { Formula } from '../src/services/formula';
import { Statement } from '../src/services/statements/statement';
import {
    joinStringsReducer,
    arrayJoinReducer,
    stringValueReducer,
    fieldReducer,
    concatReducer,
    encodeUrlComponentReducer,
    stingLenReducer,
    toUpperCaseReducer,
    trimReducer,
    textValueReducer,
    toLowerCaseReducer,
    leftReducer,
    numberValueReducer,
    rightReducer,
    repeatReducer,
    findReducer,
} from '../src/services/statements/reducers/string-operations';
import { andReducer, orReducer, xorReducer, ifReducer } from '../src/services/statements/reducers/logical-operations';

describe('Formula', () => {
    describe('reducers', () => {
        describe('base', () => {
            it('value reducer', () => {
                const formula = new Formula();
                const s = new Statement('value', stringValueReducer);
                formula.setStatement(s);
                expect(formula.getStringifiedFormula()).to.eql(`\"value\"`);
            });

            it('field reducer', () => {
                const formula = new Formula();
                const s = new Statement('value', fieldReducer);
                formula.setStatement(s);
                expect(formula.getStringifiedFormula()).to.eq('value');
            });

            it('field reducer with space', () => {
                const formula = new Formula();
                const s = new Statement('a value', fieldReducer);
                formula.setStatement(s);
                expect(formula.getStringifiedFormula()).to.eq('{a value}');
            });
        });

        describe('string', () => {
            it('&', () => {
                const formula = new Formula();
                const s1 = new Statement('test' as string, stringValueReducer);
                const a = new Statement('a' as string, stringValueReducer);
                const b = new Statement(('b' as string) as string, stringValueReducer);
                const c = new Statement('c' as string, fieldReducer);

                formula.setStatement(new Statement([a, s1], joinStringsReducer));
                expect(formula.getStringifiedFormula()).to.eq('"a" & "test"');
                formula.setStatement(new Statement([a, b, c, s1], joinStringsReducer));
                expect(formula.getStringifiedFormula()).to.eq('"a" & "b" & c & "test"');
            });

            it('ARRAYJOIN([item1, item2, item3], separator)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, fieldReducer);
                const b = new Statement('b' as string, fieldReducer);
                const c = new Statement('c' as string, fieldReducer);
                formula.setStatement(
                    new Statement(
                        {
                            parts: [a, b, c],
                            separator: ' ;',
                        },
                        arrayJoinReducer,
                    ),
                );
                expect(formula.getStringifiedFormula()).to.eq(`ARRAYJOIN(["a","b","c"], " ;")`);
            });

            it('CONCATENATE(text1, [text2, ...])', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                const b = new Statement('b' as string, stringValueReducer);
                const c = new Statement('c' as string, stringValueReducer);
                formula.setStatement(new Statement([a], concatReducer));
                expect(formula.getStringifiedFormula()).to.eq(`CONCATENATE("a")`);
                formula.setStatement(new Statement([a, b], concatReducer));
                expect(formula.getStringifiedFormula()).to.eq(`CONCATENATE("a", "b")`);
                formula.setStatement(new Statement([a, b, c], concatReducer));
                expect(formula.getStringifiedFormula()).to.eq(`CONCATENATE("a", "b", "c")`);
            });

            it('ENCODE_URL_COMPONENT(component_string)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                formula.setStatement(new Statement(a, encodeUrlComponentReducer));
                expect(formula.getStringifiedFormula()).to.eq(`ENCODE_URL_COMPONENT("a")`);
            });

            it('FIND(stringToFind, whereToSearch,[startFromPosition])', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                const longText = new Statement('a long text' as string, stringValueReducer);
                const findStatement = new Statement(
                    {
                        stringToFind: a,
                        whereToSearch: longText,
                    },
                    findReducer,
                );
                formula.setStatement(findStatement);
                expect(formula.getStringifiedFormula()).to.eq(`FIND("a", "a long text")`);

                findStatement.setValue({
                    stringToFind: a,
                    whereToSearch: longText,
                    startFromPosition: new Statement(5 as number, numberValueReducer),
                });

                expect(formula.getStringifiedFormula()).to.eq(`FIND("a", "a long text", 5)`);
            });

            it('LEFT(string, howMany)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                const number = new Statement(5 as number, numberValueReducer);
                formula.setStatement(new Statement({ statement: a, number }, leftReducer));
                expect(formula.getStringifiedFormula()).to.eq(`LEFT("a", 5)`);
            });

            it('LEN(string)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                formula.setStatement(new Statement(a, stingLenReducer));
                expect(formula.getStringifiedFormula()).to.eq(`LEN("a")`);
            });

            it('LOWER(string)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                formula.setStatement(new Statement(a, toLowerCaseReducer));
                expect(formula.getStringifiedFormula()).to.eq(`LOWER("a")`);
            });

            it('MID(string, whereToStart, count');

            it('REPLACE(string, start_character, number_of_characters, replacement)');

            it('REPT(string, number)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                const number = new Statement(5 as number, numberValueReducer);
                formula.setStatement(new Statement({ statement: a, number }, repeatReducer));
                expect(formula.getStringifiedFormula()).to.eq(`REPT("a", 5)`);
            });

            it('RIGHT(string, howMany)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                const number = new Statement(5 as number, numberValueReducer);
                formula.setStatement(new Statement({ statement: a, number }, rightReducer));
                expect(formula.getStringifiedFormula()).to.eq(`RIGHT("a", 5)`);
            });

            it('SEARCH(stringToFind, whereToSearch,[startFromPosition])');

            it('SUBSTITUTE(string, old_text, new_text, [index])');

            it('T(value1)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                formula.setStatement(new Statement(a, textValueReducer));
                expect(formula.getStringifiedFormula()).to.eq(`T("a")`);
            });

            it('TRIM(string)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                formula.setStatement(new Statement(a, trimReducer));
                expect(formula.getStringifiedFormula()).to.eq(`TRIM("a")`);
            });

            it('UPPER(string)', () => {
                const formula = new Formula();
                const a = new Statement('a' as string, stringValueReducer);
                formula.setStatement(new Statement(a, toUpperCaseReducer));
                expect(formula.getStringifiedFormula()).to.eq(`UPPER("a")`);
            });
        });

        describe('logical', () => {
            it('AND', () => {
                const a = new Statement('a' as string, fieldReducer);
                const b = new Statement('b' as string, fieldReducer);
                const c = new Statement('c' as string, fieldReducer);
                const d = new Statement('d' as string, fieldReducer);
                const f = new Formula();
                const firstStatement = new Statement([a, b, c], joinStringsReducer);
                const secondStatement = new Statement([c, d], joinStringsReducer);
                const andStatement = new Statement([firstStatement, secondStatement], andReducer);
                f.setStatement(andStatement);

                expect(f.getStringifiedFormula()).to.eq(`AND(a & b & c, c & d)`);
                const doubleAndStatement = new Statement([andStatement, firstStatement], andReducer);
                f.setStatement(doubleAndStatement);

                expect(f.getStringifiedFormula()).to.eq(`AND(AND(a & b & c, c & d), a & b & c)`);
            });
            it('OR', () => {
                const f = new Formula();
                const a = new Statement('a' as string, fieldReducer);
                const b = new Statement('b' as string, fieldReducer);
                const c = new Statement('c' as string, fieldReducer);
                const d = new Statement('d' as string, fieldReducer);
                const firstStatement = new Statement([a, b, c], joinStringsReducer);
                const secondStatement = new Statement([c, d], joinStringsReducer);
                const andStatement = new Statement([firstStatement, secondStatement], orReducer);
                f.setStatement(andStatement);

                expect(f.getStringifiedFormula()).to.eq(`OR(a & b & c, c & d)`);
                const doubleAndStatement = new Statement([andStatement, firstStatement], orReducer);
                f.setStatement(doubleAndStatement);

                expect(f.getStringifiedFormula()).to.eq(`OR(OR(a & b & c, c & d), a & b & c)`);
            });
            it('XOR', () => {
                const f = new Formula();
                const a = new Statement('a' as string, fieldReducer);
                const b = new Statement('b' as string, fieldReducer);
                const c = new Statement('c' as string, fieldReducer);
                const d = new Statement('d' as string, fieldReducer);
                const firstStatement = new Statement([a, b, c], joinStringsReducer);
                const secondStatement = new Statement([c, d], joinStringsReducer);
                const andStatement = new Statement([firstStatement, secondStatement], xorReducer);
                f.setStatement(andStatement);

                expect(f.getStringifiedFormula()).to.eq(`XOR(a & b & c, c & d)`);
                const doubleAndStatement = new Statement([andStatement, firstStatement], xorReducer);
                f.setStatement(doubleAndStatement);

                expect(f.getStringifiedFormula()).to.eq(`XOR(XOR(a & b & c, c & d), a & b & c)`);
            });
            it('IF', () => {
                const f = new Formula();
                const a = new Statement('a' as string, fieldReducer);
                const b = new Statement('b' as string, fieldReducer);
                const c = new Statement('c' as string, fieldReducer);

                const ifStatement = new Statement([a, b, c], ifReducer);
                f.setStatement(ifStatement);

                expect(f.getStringifiedFormula()).to.eq(`IF(a, b, c)`);
                const doubleIfStatement = new Statement([a, ifStatement, ifStatement], ifReducer);
                f.setStatement(doubleIfStatement);

                expect(f.getStringifiedFormula()).to.eq(`IF(a, IF(a, b, c), IF(a, b, c))`);
            });
        });
    });
});
