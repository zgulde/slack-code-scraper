/*globals describe test expect*/

const { shouldIgnoreEvent, containsCode, isSnippet, stripBackticks } = require('../eventUtils');

describe('shouldIgnoreEvent', () => {
  test('ignores an event without a type or user property.', () => {
    let event = {};
    expect(shouldIgnoreEvent(event)).toBe(true);
  });

  test('ignores an event without a user property.', () => {
    let event = {type: 'foo'};
    expect(shouldIgnoreEvent(event)).toBe(true);
  });

  test('ignores an event without a type property', () => {
    let event = {user: '123'};
    expect(shouldIgnoreEvent(event)).toBe(true);
  });

  test('ignores an event where the user id is not one of the instructors', () => {
    let event = {user: '123', type: 'message'};
    expect(shouldIgnoreEvent(event)).toBe(true);
  });

  test('ignores an event that does not have a valid type', () => {
    let event = {user: 'U1QMCDLVC', type: 'presence_change'};
    expect(shouldIgnoreEvent(event)).toBe(true);
  });

  test('accepts an event with a valid type and user', () => {
    let event = {user: 'U1QMCDLVC', type: 'message'};
    expect(shouldIgnoreEvent(event)).toBe(false);
  });
});

describe('containsCode', () => {
  test('detects code inside triple backticks', () => {
    let event = {text: '```\nmultiline code\n```'};
    expect(containsCode(event)).toBe(true);
    event = {text: '```single line code```'};
    expect(containsCode(event)).toBe(true);
  });

  test('rejects empty code blocks', () => {
    let event = {text: '```\n```'};
    expect(containsCode(event)).toBeFalsy();
    event = {text: '``````'};
    expect(containsCode(event)).toBeFalsy();
  });

  test('rejects regular text', () => {
    let event = {text: 'lorem ipsum, etc'};
    expect(containsCode(event)).toBeFalsy();
  });

  test('detects uploaded code snippet', () => {
    let event = {
      text: '',
      subtype: 'file_share',
      file: {mimetype: 'text/plain'}
    };
    expect(containsCode(event)).toBe(true);
  });

  test('does not detect image uploads as snippets', () => {
    let event = {
      text: '',
      subtype: 'file_share',
      file: {mimetype: 'image/jpeg'}
    };
    expect(containsCode(event)).toBeFalsy();
  });
});

describe('isSnippet', () => {
  test('detects a code snippet', () => {
    let event = {
      text: '',
      subtype: 'file_share',
      file: {mimetype: 'text/plain'}
    };
    expect(isSnippet(event)).toBe(true);
  });

  test('rejects a file upload', () => {
    let event = {
      text: '',
      subtype: 'file_share',
      file: {mimetype: 'image/jpeg'}
    };
    expect(isSnippet(event)).toBeFalsy();
  });

  test('rejects an empty event', () => {
    let event = {};
    expect(isSnippet(event)).toBeFalsy();
  });

  test('rejects a message with code inside triple backticks', () => {
    let event = {
      text: '```\nhere is some code\n```'
    };
    expect(isSnippet(event)).toBeFalsy();
  });
});

describe('stripBackticks', () => {
  test('removes backticks and newlines from the start and end of a string', () => {
    const s = '```\ncode\n```';
    expect(stripBackticks(s)).toBe('code');
  });
});
