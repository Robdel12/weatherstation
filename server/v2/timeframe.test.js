/* eslint-env mocha */
const expect = require('expect');
const tk = require('timekeeper');
const tf = require('./timeframe');

function utc(...args) {
  return new Date(Date.UTC(...args));
}

describe('timeframe', () => {
  tk.freeze(utc(2020, 3, 20));

  describe('#parse()', () => {
    const TESTS = [
      ['today', {
        now: utc(2020, 3, 20),
        start: utc(2020, 3, 20, 0, 0, 0, 0),
        end: utc(2020, 3, 20, 23, 59, 59, 999)
      }],
      ['yesterday', {
        now: utc(2020, 3, 19),
        start: utc(2020, 3, 19, 0, 0, 0, 0),
        end: utc(2020, 3, 19, 23, 59, 59, 999)
      }],
      ['sunday', {
        now: utc(2020, 3, 19),
        start: utc(2020, 3, 19, 0, 0, 0, 0),
        end: utc(2020, 3, 19, 23, 59, 59, 999)
      }],
      ['tuesday', {
        now: utc(2020, 3, 14),
        start: utc(2020, 3, 14, 0, 0, 0, 0),
        end: utc(2020, 3, 14, 23, 59, 59, 999)
      }],
      ['january', {
        now: utc(2020, 0, 20),
        start: utc(2020, 0, 1, 0, 0, 0, 0),
        end: utc(2020, 0, 31, 23, 59, 59, 999)
      }],
      ['november', {
        now: utc(2019, 10, 20),
        start: utc(2019, 10, 1, 0, 0, 0, 0),
        end: utc(2019, 10, 30, 23, 59, 59, 999)
      }],
      ['february 14th', {
        now: utc(2020, 1, 14),
        start: utc(2020, 1, 14, 0, 0, 0, 0),
        end: utc(2020, 1, 14, 23, 59, 59, 999)
      }],
      ['december 25th', {
        now: utc(2019, 11, 25),
        start: utc(2019, 11, 25, 0, 0, 0, 0),
        end: utc(2019, 11, 25, 23, 59, 59, 999)
      }],
      ['march 19th 2019', {
        now: utc(2019, 2, 19),
        start: utc(2019, 2, 19, 0, 0, 0, 0),
        end: utc(2019, 2, 19, 23, 59, 59, 999)
      }],
      ['january 2019', {
        now: utc(2019, 0, 1),
        start: utc(2019, 0, 1, 0, 0, 0, 0),
        end: utc(2019, 0, 31, 23, 59, 59, 999)
      }],
      ['2016', {
        now: utc(2016, 0, 1),
        start: utc(2016, 0, 1, 0, 0, 0, 0),
        end: utc(2016, 11, 31, 23, 59, 59, 999)
      }],
      ['2 weeks ago', {
        now: utc(2020, 3, 6),
        start: utc(2020, 3, 5, 0, 0, 0, 0),
        end: utc(2020, 3, 11, 23, 59, 59, 999)
      }],
      ['last 2 weeks', {
        now: utc(2020, 3, 6),
        start: utc(2020, 3, 5, 0, 0, 0, 0),
        end: utc(2020, 3, 20, 23, 59, 59, 999)
      }],
      ['10 days ago', {
        now: utc(2020, 3, 10),
        start: utc(2020, 3, 10, 0, 0, 0, 0),
        end: utc(2020, 3, 10, 23, 59, 59, 999)
      }],
      ['last 7 days', {
        now: utc(2020, 3, 13),
        start: utc(2020, 3, 13, 0, 0, 0, 0),
        end: utc(2020, 3, 20, 23, 59, 59, 999)
      }],
      ['3 months ago', {
        now: utc(2020, 0, 20),
        start: utc(2020, 0, 1, 0, 0, 0, 0),
        end: utc(2020, 0, 31, 23, 59, 59, 999)
      }],
      ['last 6 months', {
        now: utc(2019, 9, 20),
        start: utc(2019, 9, 1, 0, 0, 0, 0),
        end: utc(2020, 3, 20, 23, 59, 59, 999)
      }],
      ['a year ago', {
        now: utc(2019, 3, 20),
        start: utc(2019, 0, 1, 0, 0, 0, 0),
        end: utc(2019, 11, 31, 23, 59, 59, 999)
      }],
      ['2 years ago', {
        now: utc(2018, 3, 20),
        start: utc(2018, 0, 1, 0, 0, 0, 0),
        end: utc(2018, 11, 31, 23, 59, 59, 999)
      }],
      ['12 hours ago', {
        now: utc(2020, 3, 19, 12),
        start: utc(2020, 3, 19, 12, 0, 0, 0),
        end: utc(2020, 3, 19, 12, 59, 59, 999)
      }],
      ['last 10 minutes', {
        now: utc(2020, 3, 19, 23, 50),
        start: utc(2020, 3, 19, 23, 50, 0, 0),
        end: utc(2020, 3, 20, 23, 59, 59, 999)
      }],
      ['30 seconds ago', {
        now: utc(2020, 3, 19, 23, 59, 30),
        start: utc(2020, 3, 19, 23, 59, 30, 0),
        end: utc(2020, 3, 19, 23, 59, 30, 999)
      }],
      ['2019-07', {
        now: utc(2019, 6, 20),
        start: utc(2019, 6, 1, 0, 0, 0, 0),
        end: utc(2019, 6, 31, 23, 59, 59, 999)
      }],
      ['2019-07-10', {
        now: utc(2019, 6, 10),
        start: utc(2019, 6, 10, 0, 0, 0, 0),
        end: utc(2019, 6, 10, 23, 59, 59, 999)
      }],
      ['2019-07-10T12', {
        now: utc(2019, 6, 10, 12),
        start: utc(2019, 6, 10, 12, 0, 0, 0),
        end: utc(2019, 6, 10, 12, 59, 59, 999)
      }],
      ['2019-07-10T12:30', {
        now: utc(2019, 6, 10, 12, 30),
        start: utc(2019, 6, 10, 12, 30, 0, 0),
        end: utc(2019, 6, 10, 12, 30, 59, 999)
      }],
      ['2019-07-10T12:30:30', {
        now: utc(2019, 6, 10, 12, 30, 30),
        start: utc(2019, 6, 10, 12, 30, 30, 0),
        end: utc(2019, 6, 10, 12, 30, 30, 999)
      }],
      ['2020-W05', {
        now: utc(2020, 0, 26),
        start: utc(2020, 0, 26, 0, 0, 0, 0),
        end: utc(2020, 1, 1, 23, 59, 59, 999)
      }],
      ['2020-W052', {
        now: utc(2020, 0, 28),
        start: utc(2020, 0, 28, 0, 0, 0, 0),
        end: utc(2020, 0, 28, 23, 59, 59, 999)
      }],
      ['2020W10', {
        now: utc(2020, 2, 1),
        start: utc(2020, 2, 1, 0, 0, 0, 0),
        end: utc(2020, 2, 7, 23, 59, 59, 999)
      }],
      ['2020W101', {
        now: utc(2020, 2, 2),
        start: utc(2020, 2, 2, 0, 0, 0, 0),
        end: utc(2020, 2, 2, 23, 59, 59, 999)
      }]
    ];

    for (let [input, output] of TESTS) {
      it(`"${input}"`, () => {
        expect(tf.parse(input)).toEqual(output.now);
        expect(tf.parse(input, 'start')).toEqual(output.start);
        expect(tf.parse(input, 'end')).toEqual(output.end);
      });
    }

    it('handles overlapping month end dates', () => {
      tk.travel(utc(2020, 2, 31));
      expect(tf.parse('last month')).toEqual(utc(2020, 1, 29));
      expect(tf.parse('september')).toEqual(utc(2019, 8, 30));
      expect(tf.parse('last february')).toEqual(utc(2019, 1, 28));
    });
  });
});
