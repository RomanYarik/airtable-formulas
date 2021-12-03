import { expect } from 'chai';
import { Formula } from '../src/services/formula';

import {
    AndNode,
    CaseNode,
    IfNode,
    OrNode,
    SwitchNode,
    XorNode,
} from '../src/services/statements/reducers/logical-operations';
import {
    LogicalOperators,
    NumericOperators,
    operatorNodeGenerator,
} from '../src/services/statements/reducers/operators';
import {
    ArrayJoinNode,
    ConcatJoinNode,
    EncodeUrlComponentNode,
    FieldNode,
    FindNode,
    JoinStringsNode,
    LeftFunctionNode,
    LenNode,
    MidNode,
    ReplaceNode,
    ReptFunctionNode,
    RightFunctionNode,
    SearchNode,
    SubstituteNode,
    TextValueNode,
    ToLowerCaseNode,
    ToUpperCaseNode,
    TrimNode,
} from '../src/services/statements/reducers/string-operations';
import { NumberNode, TextNode } from '../src/services/statements/reducers/types';

describe('Formula', () => {
    describe('reducers', () => {
        describe('base', () => {
            it('base nodes', () => {
                expect(Formula.compileNode(new TextNode('value'))).to.eql(`\"value\"`);
                expect(Formula.compileNode(new FieldNode('value'))).to.eql('value');
                expect(Formula.compileNode(new FieldNode('a value'))).to.eql('{a value}');
                expect(Formula.compileNode(new NumberNode(5))).to.eql('5');
            });
        });

        describe('string', () => {
            it('&', () => {
                const s1 = new TextNode('test');
                const a = new TextNode('a');
                const b = new TextNode('b');
                const c = new FieldNode('c');

                expect(Formula.compileNode(new JoinStringsNode([a, s1]))).to.eq('"a" & "test"');
                expect(Formula.compileNode(new JoinStringsNode([a, b, c, s1]))).to.eq('"a" & "b" & c & "test"');
            });

            it('ARRAYJOIN([item1, item2, item3], separator)', () => {
                const a = new FieldNode('a');
                const b = new FieldNode('b');
                const c = new FieldNode('c');

                expect(
                    Formula.compileNode(
                        new ArrayJoinNode({
                            parts: [a, b, c],
                            separator: ' ;',
                        }),
                    ),
                ).to.eq(`ARRAYJOIN(["a","b","c"], " ;")`);
            });

            it('CONCATENATE(text1, [text2, ...])', () => {
                const a = new TextNode('a');
                const b = new TextNode('b');
                const c = new TextNode('c');
                expect(Formula.compileNode(new ConcatJoinNode([a]))).to.eq(`CONCATENATE("a")`);
                expect(Formula.compileNode(new ConcatJoinNode([a, b]))).to.eq(`CONCATENATE("a", "b")`);
                expect(Formula.compileNode(new ConcatJoinNode([a, b, c]))).to.eq(`CONCATENATE("a", "b", "c")`);
            });

            it('ENCODE_URL_COMPONENT(component_string)', () => {
                const uriComponent = new TextNode('a');
                expect(Formula.compileNode(new EncodeUrlComponentNode(uriComponent))).to.eq(
                    `ENCODE_URL_COMPONENT("a")`,
                );
            });

            it('FIND(stringToFind, whereToSearch,[startFromPosition])', () => {
                const a = new TextNode('a');
                const longText = new TextNode('a long text');
                const findStatement = new FindNode({
                    stringToFind: a,
                    whereToSearch: longText,
                });
                expect(Formula.compileNode(findStatement)).to.eq(`FIND("a", "a long text")`);

                const startFromPosition = new NumberNode(5);
                expect(
                    Formula.compileNode(
                        new FindNode({
                            stringToFind: a,
                            whereToSearch: longText,
                            startFromPosition,
                        }),
                    ),
                ).to.eq(`FIND("a", "a long text", 5)`);
            });

            it('LEFT(string, howMany)', () => {
                const a = new TextNode('a');
                const number = new NumberNode(5);
                expect(Formula.compileNode(new LeftFunctionNode({ statement: a, number }))).to.eq(`LEFT("a", 5)`);
            });

            it('LEN(string)', () => {
                const a = new TextNode('a');
                expect(Formula.compileNode(new LenNode(a))).to.eq(`LEN("a")`);
            });

            it('LOWER(string)', () => {
                const a = new TextNode('a');
                expect(Formula.compileNode(new ToLowerCaseNode(a))).to.eq(`LOWER("a")`);
            });

            it('MID(string, whereToStart, count)', () => {
                const what = new TextNode('quick brown fox');
                const whereToStart = new NumberNode(6);
                const count = new NumberNode(5);

                expect(
                    Formula.compileNode(
                        new MidNode({
                            count,
                            string: what,
                            whereToStart,
                        }),
                    ),
                ).to.eq('MID("quick brown fox", 6, 5)');
            });

            it('REPLACE(string, start_character, number_of_characters, replacement)', () => {
                const what = new TextNode('quick brown fox');
                const startChar = new NumberNode(6);
                const numberOfCharachters = new NumberNode(5);
                const replacement = new TextNode('white');

                expect(
                    Formula.compileNode(new ReplaceNode({ string: what, numberOfCharachters, replacement, startChar })),
                ).to.eq(`REPLACE("quick brown fox", 6, 5, "white")`);
            });

            it('REPT(string, number)', () => {
                const statement = new TextNode('a');
                const number = new NumberNode(5);
                expect(Formula.compileNode(new ReptFunctionNode({ statement, number }))).to.eq(`REPT("a", 5)`);
            });

            it('RIGHT(string, howMany)', () => {
                const statement = new TextNode('a');
                const number = new NumberNode(5);
                expect(Formula.compileNode(new RightFunctionNode({ number, statement }))).to.eq(`RIGHT("a", 5)`);
            });

            it('SEARCH(stringToFind, whereToSearch,[startFromPosition])', () => {
                const stringToFind = new TextNode('fox');
                const whereToSearch = new TextNode('quick brown fox');
                expect(
                    Formula.compileNode(
                        new SearchNode({
                            stringToFind,
                            whereToSearch,
                        }),
                    ),
                ).to.eq('SEARCH("fox", "quick brown fox")');

                const startFromPosition = new NumberNode(5);
                expect(Formula.compileNode(new SearchNode({ whereToSearch, stringToFind, startFromPosition }))).to.eq(
                    'SEARCH("fox", "quick brown fox", 5)',
                );
            });

            it('SUBSTITUTE(string, old_text, new_text, [index])', () => {
                const oldText = new TextNode('fox');
                const newText = new TextNode('bear');
                const whereToSearch = new TextNode('quick brown fox');
                expect(Formula.compileNode(new SubstituteNode({ string: whereToSearch, newText, oldText }))).to.eq(
                    'SUBSTITUTE("quick brown fox", "fox", "bear")',
                );
                const index = new NumberNode(5);

                expect(
                    Formula.compileNode(new SubstituteNode({ oldText, newText, string: whereToSearch, index })),
                ).to.eq('SUBSTITUTE("quick brown fox", "fox", "bear", 5)');
            });

            const a = new TextNode('a');
            expect(Formula.compileNode(new TextValueNode(a))).to.eq(`T("a")`);
        });
    });

    describe('logical', () => {
        it('AND', () => {
            const a = new FieldNode('a');
            const b = new FieldNode('b');
            const c = new FieldNode('c');
            const d = new FieldNode('d');
            const firstStatement = new JoinStringsNode([a, b, c]);
            const secondStatement = new JoinStringsNode([c, d]);
            const andStatement = new AndNode([firstStatement, secondStatement]);

            expect(Formula.compileNode(andStatement)).to.eq(`AND(a & b & c, c & d)`);
            const doubleAndStatement = new AndNode([andStatement, firstStatement]);

            expect(Formula.compileNode(doubleAndStatement)).to.eq(`AND(AND(a & b & c, c & d), a & b & c)`);
        });
        it('OR', () => {
            const a = new FieldNode('a');
            const b = new FieldNode('b');
            const c = new FieldNode('c');
            const d = new FieldNode('d');
            const firstStatement = new JoinStringsNode([a, b, c]);
            const secondStatement = new JoinStringsNode([c, d]);
            const orStatement = new OrNode([firstStatement, secondStatement]);

            expect(Formula.compileNode(orStatement)).to.eq(`OR(a & b & c, c & d)`);
            const doubleOrStatement = new OrNode([orStatement, firstStatement]);

            expect(Formula.compileNode(doubleOrStatement)).to.eq(`OR(OR(a & b & c, c & d), a & b & c)`);
        });
        it('XOR', () => {
            const a = new FieldNode('a');
            const b = new FieldNode('b');
            const c = new FieldNode('c');
            const d = new FieldNode('d');
            const firstStatement = new JoinStringsNode([a, b, c]);
            const secondStatement = new JoinStringsNode([c, d]);
            const xorStatement = new XorNode([firstStatement, secondStatement]);

            expect(Formula.compileNode(xorStatement)).to.eq(`XOR(a & b & c, c & d)`);
            const doubleXorStatement = new XorNode([xorStatement, firstStatement]);

            expect(Formula.compileNode(doubleXorStatement)).to.eq(`XOR(XOR(a & b & c, c & d), a & b & c)`);
        });
        it('IF', () => {
            const condition = new FieldNode('a');
            const trueNode = new FieldNode('b');
            const falseNode = new FieldNode('c');

            const ifNode = new IfNode({
                condition,
                true: trueNode,
                false: falseNode,
            });

            expect(Formula.compileNode(ifNode)).to.eq(`IF(a, b, c)`);

            const doubleIfNode = new IfNode({
                condition,
                true: ifNode,
                false: ifNode,
            });

            expect(Formula.compileNode(doubleIfNode)).to.eq(`IF(a, IF(a, b, c), IF(a, b, c))`);

            it('TRIM(string)', () => {
                const a = new TextNode('a');
                expect(Formula.compileNode(new TrimNode(a))).to.eq(`TRIM("a")`);
            });

            it('UPPER(string)', () => {
                const a = new TextNode('a');
                expect(Formula.compileNode(new ToUpperCaseNode(a))).to.eq(`UPPER("a")`);
            });
        });
        it('SWITCH', () => {
            const case1 = new CaseNode({
                value: new TextNode('case1 value'),
                condition: new FieldNode('case1 field'),
            });

            const case2 = new CaseNode({
                value: new FieldNode('case2_value'),
                condition: new NumberNode(5),
            });

            const case3 = new CaseNode({ value: new NumberNode(10) });

            expect(
                Formula.compileNode(
                    new SwitchNode({
                        pattern: new FieldNode('some-field'),
                        cases: [case1, case2, case3],
                    }),
                ),
            ).to.eq('SWITCH(some-field, {case1 field}, "case1 value", 5, case2_value, 10)');
        });
    });

    describe('operators', () => {
        const numberNode = new NumberNode(5);
        for (const op of NumericOperators) {
            it(`${op}`, () => {
                const OpNode = operatorNodeGenerator(op);
                expect(Formula.compileNode(new OpNode({ left: numberNode, right: numberNode }))).to.eq(`5 ${op} 5`);
            });
        }
        const textNode = new TextNode('value');
        for (const op of LogicalOperators) {
            it(`${op}`, () => {
                const LogicNode = operatorNodeGenerator(op);
                expect(Formula.compileNode(new LogicNode({ left: textNode, right: textNode }))).to.eq(
                    `"value" ${op} "value"`,
                );
            });
        }
    });
});
