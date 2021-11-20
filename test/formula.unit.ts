import { expect } from 'chai';
import { Formula } from '../src/services/formula';
import { Statement } from '../src/services/statements/statement';
import {
    joinStringsReducer,
    arrayJoinReducer,
    fieldReducer,
    concatReducer,
    encodeUrlComponentReducer,
    stingLenReducer,
    toUpperCaseReducer,
    trimReducer,
    textValueReducer,
    toLowerCaseReducer,
    leftReducer,
    numericValueReducer,
    rightReducer,
    repeatReducer,
    findReducer,
    midReducer,
    replaceReducer,
    searchReducer,
    substituteReducer,
    stringValueReducer,
} from '../src/services/statements/reducers/string-operations';
import {
    andReducer,
    orReducer,
    xorReducer,
    ifReducer,
    switchReducer,
    caseReducer,
} from '../src/services/statements/reducers/logical-operations';
import {
    LogicalOperators,
    NumericOperators,
    operatorReducerGenerator,
} from '../src/services/statements/reducers/operators';

describe('Formula', () => {
    describe('reducers', () => {
        xdescribe('base', () => {
            it('value reducer', () => {
                const formula = new Formula();
                const s = new Statement(stringValueReducer, 'value');
                formula.setStatement(s);
                expect(formula.build()).to.eql(`\"value\"`);
            });

            it('field reducer', () => {
                const formula = new Formula();
                const s = new Statement(fieldReducer, 'value');
                formula.setStatement(s);
                expect(formula.build()).to.eq('value');
            });

            it('field reducer with space', () => {
                const formula = new Formula();
                const s = new Statement(fieldReducer, 'a value');
                formula.setStatement(s);
                expect(formula.build()).to.eq('{a value}');
            });
        });

        xdescribe('string', () => {
            it('&', () => {
                const formula = new Formula();
                const s1 = new Statement(stringValueReducer, 'test');
                const a = new Statement(stringValueReducer, 'a');
                const b = new Statement(stringValueReducer, 'b');
                const c = new Statement(fieldReducer, 'c');

                formula.setStatement(new Statement(joinStringsReducer, [a, s1]));
                expect(formula.build()).to.eq('"a" & "test"');
                formula.setStatement(new Statement(joinStringsReducer, [a, b, c, s1]));
                expect(formula.build()).to.eq('"a" & "b" & c & "test"');
            });

            it('ARRAYJOIN([item1, item2, item3], separator)', () => {
                const formula = new Formula();
                const a = new Statement(fieldReducer, 'a');
                const b = new Statement(fieldReducer, 'b');
                const c = new Statement(fieldReducer, 'c');
                formula.setStatement(
                    new Statement(arrayJoinReducer, {
                        parts: [a, b, c],
                        separator: ' ;',
                    }),
                );
                expect(formula.build()).to.eq(`ARRAYJOIN(["a","b","c"], " ;")`);
            });

            it('CONCATENATE(text1, [text2, ...])', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                const b = new Statement(stringValueReducer, 'b');
                const c = new Statement(stringValueReducer, 'c');
                formula.setStatement(new Statement(concatReducer, [a]));
                expect(formula.build()).to.eq(`CONCATENATE("a")`);
                formula.setStatement(new Statement(concatReducer, [a, b]));
                expect(formula.build()).to.eq(`CONCATENATE("a", "b")`);
                formula.setStatement(new Statement(concatReducer, [a, b, c]));
                expect(formula.build()).to.eq(`CONCATENATE("a", "b", "c")`);
            });

            it('ENCODE_URL_COMPONENT(component_string)', () => {
                const formula = new Formula();
                const uriComponent = new Statement(stringValueReducer, 'a');
                formula.setStatement(new Statement(encodeUrlComponentReducer, uriComponent));
                expect(formula.build()).to.eq(`ENCODE_URL_COMPONENT("a")`);
            });

            it('FIND(stringToFind, whereToSearch,[startFromPosition])', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                const longText = new Statement(stringValueReducer, 'a long text');
                const findStatement = new Statement(findReducer, {
                    stringToFind: a,
                    whereToSearch: longText,
                });
                formula.setStatement(findStatement);
                expect(formula.build()).to.eq(`FIND("a", "a long text")`);

                const startFromPosition = new Statement(numericValueReducer, 5);
                findStatement.setValue({
                    stringToFind: a,
                    whereToSearch: longText,
                    startFromPosition,
                });

                expect(formula.build()).to.eq(`FIND("a", "a long text", 5)`);
            });

            it('LEFT(string, howMany)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                const number = new Statement(numericValueReducer, 5);
                formula.setStatement(new Statement(leftReducer, { statement: a, number }));
                expect(formula.build()).to.eq(`LEFT("a", 5)`);
            });

            it('LEN(string)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                formula.setStatement(new Statement(stingLenReducer, a));
                expect(formula.build()).to.eq(`LEN("a")`);
            });

            it('LOWER(string)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                formula.setStatement(new Statement(toLowerCaseReducer, a));
                expect(formula.build()).to.eq(`LOWER("a")`);
            });

            it('MID(string, whereToStart, count)', () => {
                const formula = new Formula();
                const what = new Statement(stringValueReducer, 'quick brown fox');
                const whereToStart = new Statement(numericValueReducer, 6);
                const count = new Statement(numericValueReducer, 5);
                formula.setStatement(
                    new Statement(midReducer, {
                        string: what,
                        count,
                        whereToStart,
                    }),
                );

                expect(formula.build()).to.eq('MID("quick brown fox", 6, 5)');
            });

            it('REPLACE(string, start_character, number_of_characters, replacement)', () => {
                const formula = new Formula();
                const what = new Statement(stringValueReducer, 'quick brown fox');
                const startChar = new Statement(numericValueReducer, 6);
                const numberOfCharachters = new Statement(numericValueReducer, 5);
                const replacement = new Statement(stringValueReducer, 'white');

                const st = new Statement(replaceReducer, {
                    numberOfCharachters,
                    replacement,
                    startChar,
                    string: what,
                });
                formula.setStatement(st);
                expect(formula.build()).to.eq(`REPLACE("quick brown fox", 6, 5, "white")`);
            });

            it('REPT(string, number)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                const number = new Statement(numericValueReducer, 5);
                formula.setStatement(new Statement(repeatReducer, { statement: a, number }));
                expect(formula.build()).to.eq(`REPT("a", 5)`);
            });

            it('RIGHT(string, howMany)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                const number = new Statement(numericValueReducer, 5);
                formula.setStatement(new Statement(rightReducer, { statement: a, number }));
                expect(formula.build()).to.eq(`RIGHT("a", 5)`);
            });

            it('SEARCH(stringToFind, whereToSearch,[startFromPosition])', () => {
                const formula = new Formula();
                const stringToFind = new Statement(stringValueReducer, 'fox');
                const whereToSearch = new Statement(stringValueReducer, 'quick brown fox');
                formula.setStatement(
                    new Statement(searchReducer, {
                        stringToFind,
                        whereToSearch,
                    }),
                );
                expect(formula.build()).to.eq('SEARCH("fox", "quick brown fox")');
                formula.setStatement(
                    new Statement(searchReducer, {
                        stringToFind,
                        whereToSearch,
                        startFromPosition: new Statement(numericValueReducer, 5),
                    }),
                );
                expect(formula.build()).to.eq('SEARCH("fox", "quick brown fox", 5)');
            });

            it('SUBSTITUTE(string, old_text, new_text, [index])', () => {
                const formula = new Formula();
                const oldText = new Statement(stringValueReducer, 'fox');
                const newText = new Statement(stringValueReducer, 'bear');
                const whereToSearch = new Statement(stringValueReducer, 'quick brown fox');
                formula.setStatement(
                    new Statement(substituteReducer, {
                        string: whereToSearch,
                        newText,
                        oldText,
                    }),
                );
                expect(formula.build()).to.eq('SUBSTITUTE("quick brown fox", "fox", "bear")');
                formula.setStatement(
                    new Statement(substituteReducer, {
                        string: whereToSearch,
                        newText,
                        oldText,
                        index: new Statement(numericValueReducer, 5),
                    }),
                );
                expect(formula.build()).to.eq('SUBSTITUTE("quick brown fox", "fox", "bear", 5)');
            });

            it('T(value1)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                formula.setStatement(new Statement(textValueReducer, a));
                expect(formula.build()).to.eq(`T("a")`);
            });

            it('TRIM(string)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                formula.setStatement(new Statement(trimReducer, a));
                expect(formula.build()).to.eq(`TRIM("a")`);
            });

            it('UPPER(string)', () => {
                const formula = new Formula();
                const a = new Statement(stringValueReducer, 'a');
                formula.setStatement(new Statement(toUpperCaseReducer, a));
                expect(formula.build()).to.eq(`UPPER("a")`);
            });
        });

        describe('logical', () => {
            it('AND', () => {
                const a = new Statement(fieldReducer, 'a');
                const b = new Statement(fieldReducer, 'b');
                const c = new Statement(fieldReducer, 'c');
                const d = new Statement(fieldReducer, 'd');
                const f = new Formula();
                const firstStatement = new Statement(joinStringsReducer, [a, b, c]);
                const secondStatement = new Statement(joinStringsReducer, [c, d]);
                const andStatement = new Statement(andReducer, [firstStatement, secondStatement]);
                f.setStatement(andStatement);

                expect(f.build()).to.eq(`AND(a & b & c, c & d)`);
                const doubleAndStatement = new Statement(andReducer, [andStatement, firstStatement]);
                f.setStatement(doubleAndStatement);

                expect(f.build()).to.eq(`AND(AND(a & b & c, c & d), a & b & c)`);
            });
            it('OR', () => {
                const f = new Formula();
                const a = new Statement(fieldReducer, 'a');
                const b = new Statement(fieldReducer, 'b');
                const c = new Statement(fieldReducer, 'c');
                const d = new Statement(fieldReducer, 'd');
                const firstStatement = new Statement(joinStringsReducer, [a, b, c]);
                const secondStatement = new Statement(joinStringsReducer, [c, d]);
                const andStatement = new Statement(orReducer, [firstStatement, secondStatement]);
                f.setStatement(andStatement);

                expect(f.build()).to.eq(`OR(a & b & c, c & d)`);
                const doubleAndStatement = new Statement(orReducer, [andStatement, firstStatement]);
                f.setStatement(doubleAndStatement);

                expect(f.build()).to.eq(`OR(OR(a & b & c, c & d), a & b & c)`);
            });
            it('XOR', () => {
                const f = new Formula();
                const a = new Statement(fieldReducer, 'a');
                const b = new Statement(fieldReducer, 'b');
                const c = new Statement(fieldReducer, 'c');
                const d = new Statement(fieldReducer, 'd');
                const firstStatement = new Statement(joinStringsReducer, [a, b, c]);
                const secondStatement = new Statement(joinStringsReducer, [c, d]);
                const andStatement = new Statement(xorReducer, [firstStatement, secondStatement]);
                f.setStatement(andStatement);

                expect(f.build()).to.eq(`XOR(a & b & c, c & d)`);
                const doubleAndStatement = new Statement(xorReducer, [andStatement, firstStatement]);
                f.setStatement(doubleAndStatement);

                expect(f.build()).to.eq(`XOR(XOR(a & b & c, c & d), a & b & c)`);
            });
            it('IF', () => {
                const f = new Formula();
                const a = new Statement(fieldReducer, 'a');
                const b = new Statement(fieldReducer, 'b');
                const c = new Statement(fieldReducer, 'c');

                const ifStatementTouple: [Statement<string>, Statement<string>, Statement<string>] = [a, b, c];

                const ifStatement = new Statement(ifReducer, ifStatementTouple);
                f.setStatement(ifStatement);

                expect(f.build()).to.eq(`IF(a, b, c)`);
                const aaa = [a, ifStatement, ifStatement] as const;
                const doubleIfStatement = new Statement(ifReducer, aaa);
                f.setStatement(doubleIfStatement);

                expect(f.build()).to.eq(`IF(a, IF(a, b, c), IF(a, b, c))`);
            });
            it('SWITCH', () => {
                const f = new Formula();
                const case1 = new Statement(caseReducer, {
                    value: new Statement(stringValueReducer, 'case1 value'),
                    condition: new Statement(fieldReducer, 'case1 field'),
                });

                const case2 = new Statement(caseReducer, {
                    value: new Statement(fieldReducer, 'case2_value'),
                    condition: new Statement(numericValueReducer, 5),
                });

                const case3 = new Statement(caseReducer, { value: new Statement(numericValueReducer, 10) });
                f.setStatement(
                    new Statement(switchReducer, {
                        pattern: new Statement(fieldReducer, 'some-field'),
                        cases: [case1, case2, case3],
                    }),
                );
                expect(f.build()).to.eq('SWITCH(some-field, {case1 field}, "case1 value", 5, case2_value, 10)');
            });
        });

        describe('operators', () => {
            for (const op of NumericOperators) {
                const statement = new Statement(numericValueReducer, 5);
                it(`${op}`, () => {
                    const formula = new Formula();
                    formula.setStatement(
                        new Statement(operatorReducerGenerator(op), { left: statement, right: statement }),
                    );
                    expect(formula.build()).to.eq(`5 ${op} 5`);
                });
            }
            for (const op of LogicalOperators) {
                const statement = new Statement(stringValueReducer, 'value');
                it(`${op}`, () => {
                    const formula = new Formula();
                    formula.setStatement(
                        new Statement(operatorReducerGenerator(op), { left: statement, right: statement }),
                    );
                    expect(formula.build()).to.eq(`"value" ${op} "value"`);
                });
            }
        });
    });
});
