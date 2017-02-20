/*globals describe test expect*/

const dbc = require('../dbc');
const seeder = require('../seeder');
const { insert } = require('../persistance');

beforeAll(done => {
  seeder.run((err, results) => {
    if (err) throw err;
    done();
  });
});

afterAll(() => {
  dbc.end();
});

const isNumeric = possibleNumber => ! isNaN(possibleNumber);

describe('database integration', () => {
  
  test('connects to database successfully', done => {
    dbc.query('select 1 + 1 as solution', (err, results, fields) => {
      if (err) throw err;
      expect(results[0].solution).toBe(2);
      done();
    });
  });

  test('inserts a record and returns its id', done => {
    insert('a code sample', 'someauthor', id => {
      expect(isNumeric(id)).toBe(true);
      done();
    })
  });

  test('inserted record can be found', done => {
    insert('some code sample', 'someauthor', id => {
      dbc.query('select * from code_samples where id = ?', [id], (err, results, fields) => {
        let { code, author } = results[0];
        expect(code).toBe('some code sample');
        expect(author).toBe('someauthor');
        done();
      })
    });
  });

});
