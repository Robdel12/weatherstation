const FRAME_REG = /^(?:last\s)?(?:(\d+|a)\s)?((?<!^)[a-z]+?)s?(?:\sago)?$/i;
const DATE_REG = /^([a-z]+?)?(?:\s(\d{1,2})(?:st|nd|rd|th))?\s?(\d{4})?$/i;
const ISO_REG = /^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2})(?:T(\d{2})(?::(\d{2})(?::(\d{2}))?)?)?)?|-?W(\d{2})(\d)?)$/i;

/* there is a lot of similar but different date stuff here and these rules make
 * it more verbose than it already is; disable them */
/* eslint-disable no-sequences, object-property-newline, no-return-assign */
const tf = {
  now: () => new Date(),

  second: {
    start: (d = tf.now()) => (d.setUTCMilliseconds(0), d),
    end: (d = tf.now()) => (d.setUTCMilliseconds(999), d),
    ago: (n = 1, d = tf.now()) => (d.setUTCSeconds(d.getUTCSeconds() - n), d)
  },
  minute: {
    start: (d = tf.now()) => (d.setUTCSeconds(0, 0), d),
    end: (d = tf.now()) => (d.setUTCSeconds(59, 999), d),
    ago: (n = 1, d = tf.now()) => (d.setUTCMinutes(d.getUTCMinutes() - n), d)
  },
  hour: {
    start: (d = tf.now()) => (d.setUTCMinutes(0, 0, 0), d),
    end: (d = tf.now()) => (d.setUTCMinutes(59, 59, 999), d),
    ago: (n = 1, d = tf.now()) => (d.setUTCHours(d.getUTCHours() - n), d)
  },
  day: {
    start: (d = tf.now()) => (d.setUTCHours(0, 0, 0, 0), d),
    end: (d = tf.now()) => (d.setUTCHours(23, 59, 59, 999), d),
    ago: (n = 1, d = tf.now()) => (d.setUTCDate(d.getUTCDate() - n), d),
    of: (i, d = tf.now()) => tf.day.ago(d.getUTCDay() - (i >= d.getUTCDay() ? i - 7 : i), d),
    index: {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    }
  },
  week: {
    start: (d = tf.now()) => tf.day.start(tf.day.ago(d.getUTCDay(), d)),
    end: (d = tf.now()) => tf.day.end(tf.day.ago(d.getUTCDay() - 6, d)),
    ago: (n = 1, d = tf.now()) => tf.day.ago(n * 7, d),
    of: (w, d = tf.now()) => tf.week.ago(-w, tf.day.of(4, tf.year.start(d)))
  },
  month: {
    start: (d = tf.now()) => (d.setUTCDate(1), tf.day.start(d)),
    end: (d = tf.now()) => (d.setUTCMonth(d.getUTCMonth() + 1, 0), tf.day.end(d)),
    ago: (n = 1, d = tf.now()) => tf.month.of(d.getUTCMonth() - n, d),
    of: (m, d = tf.now()) => tf.set(d, undefined, m),
    length: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    index: {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11
    }
  },
  year: {
    start: (d = tf.now()) => (d.setUTCMonth(0, 1), tf.day.start(d)),
    end: (d = tf.now()) => (d.setUTCFullYear(d.getUTCFullYear() + 1, 0, 0), tf.day.end(d)),
    ago: (n = 1, d = tf.now()) => tf.set(d, d.getUTCFullYear() - n)
  },

  set: (d, y, m = d.getUTCMonth(), i = d.getUTCDate(), h, mi, s) => {
    // only look to past months when year is absent
    m = (!y && m > d.getUTCMonth()) ? m - 12 : m;
    // find the target year
    y = Math.floor(m / 12) + (y ? +y : d.getUTCFullYear());
    // adjust the target month to the year
    m = (m = m % 12, m < 0 ? 12 + m : m > 11 ? m - 12 : m);
    // the date is clamped so the month doesn't roll over
    i = Math.min(i, (m === 1 && y % 4 === 0) ? 29 : tf.month.length[m]);
    // set year, month, date
    d.setUTCFullYear(y, m, i);
    // maybe set hour, minute, second
    if (h) d.setUTCHours(h, mi || d.getUTCMinutes(), s || d.getUTCSeconds());
    // return the date
    return d;
  },

  // @todo - time of day? what hour corresponds to each time?
  // "this morning"
  // "this afternoon"
  // "yesterday morning"
  // "yesterday afternoon"
  // "last night"
  parse: (frame, clamp) => {
    let d, u, n, m;

    try {
      let f = frame.toLowerCase();

      // this is actually artificial intelligence at work
      if (f === 'today') {
        d = tf.now();
        u = 'day';
      } else if (f === 'yesterday') {
        d = tf.day.ago();
        u = 'day';
      } else if (tf.day.index[f] != null) {
        d = tf.day.of(tf.day.index[f]);
        u = 'day';
      } else if (tf.month.index[f] != null) {
        d = tf.month.of(tf.month.index[f]);
        u = 'month';
      } else if (f.indexOf('last ') === 0 && clamp === 'end') {
        d = tf.now();
        u = 'day';
      } else if (f.indexOf('this') === 0) {
        [, u] = f.split(' ');
        d = tf.now();
      } else if ((m = f.match(DATE_REG))) {
        d = tf.set(tf.now(), m[3], m[1] ? tf.month.index[m[1]] : 0, m[2] || 1);
        u = m[2] ? 'day' : m[1] ? 'month' : 'year';
      } else if ((m = f.match(ISO_REG))) {
        d = m[7] && tf.day.of(m[8] || 0, tf.week.of(m[7]));
        d = d || tf.set(tf.now(), m[1], m[2] - 1, m[3], m[4], m[5], m[6]);
        // eslint-disable-next-line
        u = m[6] ? 'second' : m[5] ? 'minute' : m[4] ? 'hour'
          : (m[3] || m[8]) ? 'day' : m[7] ? 'week' : 'month';
      } else if ((m = f.match(FRAME_REG))) {
        n = (m[1] && m[1] !== 'a') ? m[1] : undefined;

        if (tf.day.index[m[2]] != null) {
          d = tf.week.ago(n, tf.day.of(tf.day.index[m[2]]));
          u = 'day';
        } else if (tf.month.index[m[2]] != null) {
          d = tf.year.ago(n, tf.month.of(tf.month.index[m[2]]));
          u = 'month';
        } else {
          u = m[2];
          d = tf[u].ago(n);
        }
      }

      return clamp ? tf[u][clamp](d) : d;
    } catch (e) {
      console.log('e = ', e);
      d = new Date(frame);
      if (!isNaN(d.getTime())) return d;
      throw new Error(`Unrecognizable timeframe: ${frame}`);
    }
  },

  range: (from, to) => [
    tf.parse(from, 'start'),
    tf.parse(to || from, 'end')
  ]
};

module.exports = tf;
