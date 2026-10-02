import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSimpleArithmetic, needsArithmetic } from './parseArithmetic.js'

test('2 + 2 => 4', () => {
  const result = parseSimpleArithmetic('2 + 2')
  assert.equal(result.answer, 4)
  assert.equal(result.left, 2)
  assert.equal(result.right, 2)
  assert.equal(result.operator, '+')
})

test('9 - 5 => 4', () => {
  const result = parseSimpleArithmetic('9 - 5')
  assert.equal(result.answer, 4)
})

test('3 * 3 => 9', () => {
  const result = parseSimpleArithmetic('3 * 3')
  assert.equal(result.answer, 9)
})

test('8 / 2 => 4', () => {
  const result = parseSimpleArithmetic('8 / 2')
  assert.equal(result.answer, 4)
})

test('10 % 3 => 1', () => {
  const result = parseSimpleArithmetic('10 % 3')
  assert.equal(result.answer, 1)
})

test('8 / 0 does not crash and returns no usable result', () => {
  const result = parseSimpleArithmetic('8 / 0')
  assert.equal(result, null)
})

test('10 % 0 does not crash and returns no usable result', () => {
  const result = parseSimpleArithmetic('10 % 0')
  assert.equal(result, null)
})

test('extracts the expression from inside a full sentence', () => {
  const result = parseSimpleArithmetic('What is 2+2?')
  assert.equal(result.expression, '2+2')
  assert.equal(result.answer, 4)
})

test('supports a negative left operand', () => {
  const result = parseSimpleArithmetic('-3 + 5')
  assert.equal(result.answer, 2)
})

test('returns null when there is no parseable expression', () => {
  assert.equal(parseSimpleArithmetic('Fix this loop'), null)
  assert.equal(parseSimpleArithmetic('Center the login button'), null)
})

test('never produces Infinity or NaN', () => {
  for (const task of ['8 / 0', '10 % 0', '0 / 0', '0 % 0']) {
    const result = parseSimpleArithmetic(task)
    if (result) {
      assert.ok(Number.isFinite(result.answer), `${task} produced a non-finite answer`)
    }
  }
})

test('needsArithmetic detects {expression}/{answer} placeholders', () => {
  assert.equal(needsArithmetic('Copilot says {answer}'), true)
  assert.equal(needsArithmetic('runs python -c "print({expression})"'), true)
  assert.equal(needsArithmetic('writes a design doc'), false)
})
