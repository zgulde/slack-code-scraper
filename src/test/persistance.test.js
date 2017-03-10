/*globals describe test expect beforeAll afterAll*/

const dbc = require('../dbc');
const seeder = require('../seeder');
const { insert } = require('../persistance');
const { savePlaintext, saveSnippet, save } = require('../eventUtils');
const fs = require('fs');

beforeAll(done => {
  seeder.run(err => {
    if (err) throw err;
    done();
  });
});

afterAll(() => {
  dbc.end();
});

const isNumeric = possibleNumber => ! isNaN(possibleNumber);

describe('basic database interaction', () => {
  test('connects to database successfully', done => {
    dbc.query('select 1 + 1 as solution', (err, results) => {
      if (err) {
        throw err;
      }
      expect(results[0].solution).toBe(2);
      done();
    });
  });
});

describe('insert function', () => {
  test('inserts a record and returns its id', done => {
    insert('a code sample', 'someauthor', 'some title',  id => {
      expect(isNumeric(id)).toBe(true);
      done();
    });
  });

  test('inserted record can be found by its id', done => {
    insert('some code sample', 'someauthor', 'some title', id => {
      dbc.query('select * from code_samples where id = ?', [id], (err, results) => {
        const { code, author } = results[0];
        expect(code).toBe('some code sample');
        expect(author).toBe('someauthor');
        done();
      });
    });
  });

  test('adds a created_at timestamp when inserting', done => {
    const dateRe = /\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/;

    insert('timestamp test', 'someauthor', 'some title', id => {
      // turn off typecasting so we can check the timestamp as a string,
      // otherwise the mysql library casts it to a JS Date object
      const queryOptions = {
        sql: 'select * from code_samples where id = ?',
        typeCast: false
      };
      dbc.query(queryOptions, [id], (err, results) => {
        const { created_at } = results[0];
        expect(created_at.toString()).toMatch(dateRe);
        done();
      });
    });
  });

});

describe('information from events is extracted and saved to the db', () => {
  const plainTextEvent = {
    text: '```\nhere is a code sample\n```',
    user: 'U1UH3NFJ8',
  };

  const fileUploadEvent = JSON.parse(
    fs.readFileSync(`${__dirname}/file-upload-event.json`).toString()
  );

  test('savePlaintext saves text to the db without backticks', done => {
    savePlaintext(plainTextEvent, id => {
      expect(isNumeric(id)).toBe(true);
      dbc.query('select * from code_samples where id = ?', [id], (err, results) => {
        let { code, author } = results[0];
        expect(code).toBe('here is a code sample');
        expect(author).toBe('zach');
        done();
      });
    });
  });
  test('saveSnippet retrieves the file from slack and stores to the db', done => {
    saveSnippet(fileUploadEvent, id => {
      expect(isNumeric(id)).toBe(true);
      dbc.query('select * from code_samples where id = ?', [id], (err, results) => {
        const { code, author, title } = results[0];
        expect(title).toBe('Untitled');
        expect(code).toBe('hey there');
        expect(author).toBe('zach');
        done();
      });
    });
  });
  test('save() properly recognizes and saves a plaintext code samples', done => {
    save(plainTextEvent, id => {
      expect(isNumeric(id)).toBe(true);
      dbc.query('select * from code_samples where id = ?', [id], (err, results) => {
        const { code, author } = results[0];
        expect(code).toBe('here is a code sample');
        expect(author).toBe('zach');
        done();
      });
    });
  });
  test('save() properly recognizes and saves an uploaded snippet', done => {
    save(fileUploadEvent, id => {
      expect(isNumeric(id)).toBe(true);
      dbc.query('select * from code_samples where id = ?', [id], (err, results) => {
        const { code, author, title } = results[0];
        expect(title).toBe('Untitled');
        expect(code).toBe('hey there');
        expect(author).toBe('zach');
        done();
      });
    });
  });
});
