function type(data) {
  if (typeof data === "function") {
    return 0;
  } else if (Array.isArray(data)) {
    return 1;
  } else if (typeof data === "object") {
    return 2;
  } else if (typeof data === "string") {
    return 3;
  } else if (typeof data === "number") {
    return 4;
  }
}
function choice(a) {
  return a[this.random(0, a.length)];
}
function chunk(a, n) {
  if (n) {
    n = Math.abs(n);
  } else {
    n = 1;
  }
  const chunks = [];
  for (let i = 0; i < a.length; i += n) {
    chunks.push(a.slice(i, i + n));
  }
  return chunks;
}
function countif(a, rule) {
  let count = 0;
  if (type(rule) === 1) {
    for (const item of a) {
      let s = "";
      for (let i = 1; i < rule.length; i++) {
        if (i - 1) {
          s += `${rule[0]}(${JSON.stringify(item)}${rule[i]})`;
        } else {
          s += `(${JSON.stringify(item)}${rule[i]})`;
        }
      }
      if (new Function(`return ${s}`)())
        count++;
    }
  } else {
    for (const item of a) {
      if (new Function(`return ${JSON.stringify(item)}${rule}`)())
        count++;
    }
  }
  return count;
}
function distill(a, rule) {
  if (type(rule) === 1) {
    return [a.filter((x) => this.matchesProperty(rule[0], rule[1])(x)), a.filter((x) => !this.matchesProperty(rule[0], rule[1])(x))];
  } else if (type(rule) === 2) {
    return [a.filter((x) => this.matches(rule)(x)), a.filter((x) => !this.matches(rule)(x))];
  } else if (type(rule) === 3) {
    return [a.filter((x) => this.property(rule)(x)), a.filter((x) => !this.property(rule)(x))];
  } else {
    return [a.filter((x) => rule(x, a)), a.filter((x) => !rule(x, a))];
  }
}
function exclude(...arrays) {
  let all = [];
  for (const a of arrays) {
    all = all.concat(a);
  }
  const track = [];
  const inter = [];
  for (const item of all) {
    this.includes(track, item) ? inter.push(item) : track.push(item);
  }
  return all.filter((x) => !this.includes(inter, x));
}
function filter(a, rule) {
  if (type(rule) === 1) {
    return a.filter((x) => this.matchesProperty(rule[0], rule[1])(x));
  } else if (type(rule) === 2) {
    return a.filter((x) => this.matches(rule)(x));
  } else if (type(rule) === 3) {
    return a.filter((x) => this.property(rule)(x));
  } else {
    return a.filter((x) => rule(x, a));
  }
}
function find(a, rule) {
  if (type(rule) === 1) {
    for (let i = 0; i < a.length; i++) {
      if (this.matchesProperty(rule[0], rule[1])(a[i]))
        return a[i];
    }
  } else if (type(rule) === 2) {
    for (let i = 0; i < a.length; i++) {
      if (this.matches(rule)(a[i]))
        return a[i];
    }
  } else if (type(rule) === 3) {
    for (let i = 0; i < a.length; i++) {
      if (this.property(rule)(a[i]))
        return a[i];
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      if (rule(a[i]))
        return a[i];
    }
  }
}
function findIndexes(a, rule) {
  let idx = [];
  if (type(rule) === 1) {
    for (let i = 0; i < a.length; i++) {
      if (this.matchesProperty(rule[0], rule[1])(a[i]))
        idx.push(i);
    }
  } else if (type(rule) === 2) {
    for (let i = 0; i < a.length; i++) {
      if (this.matches(rule)(a[i]))
        idx.push(i);
    }
  } else if (type(rule) === 3) {
    for (let i = 0; i < a.length; i++) {
      if (this.property(rule)(a[i]))
        idx.push(i);
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      if (rule(a[i]))
        idx.push(i);
    }
  }
  return idx;
}
function ifelse(a, yes, no, fn) {
  const list = [];
  for (let i = 0; i < a.length; i++) {
    if (fn(a[i])) {
      list.push(yes);
    } else {
      list.push(no);
    }
  }
  return list;
}
function includes(a, item) {
  for (let i = 0; i < a.length; i++) {
    if (this.eq(a[i], item))
      return true;
  }
  return false;
}
function indexes(a, item) {
  let idx = [];
  for (let i = 0; i < a.length; i++) {
    if (this.eq(a[i], item)) {
      idx.push(i);
    }
  }
  return idx;
}
function intersect(...arrays) {
  let all = [];
  for (const a of arrays) {
    all = all.concat(a);
  }
  return all.filter((x) => {
    for (const a of arrays) {
      if (!this.includes(a, x)) {
        return false;
      }
    }
    return true;
  });
}
function insert(a, index, item) {
  a.splice(index, 0, item);
  return a;
}
function iterate(arrays, fn) {
  const data = [];
  for (let i = 0; i < arrays[0].length; i++) {
    const items = [];
    for (const a of arrays) {
      items.push(a[i]);
    }
    data.push(fn(items));
  }
  return data;
}
function last(a) {
  return a[a.length - 1];
}
function matches(rule) {
  return (o) => {
    for (const [key, value] of Object.entries(rule)) {
      if (o[key] !== value && !this.eq(o[key], value))
        return false;
    }
    return true;
  };
}
function matchesProperty(key, value) {
  return (o) => {
    return this.eq(o[key], value);
  };
}
function must(rule) {
  return (o) => {
    for (const [key, value] of Object.entries(rule)) {
      if (type(value) === 3) {
        if (!new Function(`return ${JSON.stringify(o[key])}${value}`)())
          return false;
      } else if (type(value) === 1) {
        let s = "";
        for (let i = 1; i < value.length; i++) {
          if (i - 1) {
            s += `${value[0]}(${JSON.stringify(o[key])}${value[i]})`;
          } else {
            s += `(${JSON.stringify(o[key])}${value[i]})`;
          }
        }
        if (!new Function(`return ${s}`)())
          return false;
      }
    }
    return true;
  };
}
function ndarray(n, d) {
  let o = {
    length: n,
    dimensions: d,
    data: []
  };
  for (let i = 0; i < n ** d; i++) {
    o.data.push(this.ndpoint(i, n, d));
  }
  return o;
}
function ndindex(coords, n) {
  let index = 0;
  for (let i = 0; i < coords.length; i++) {
    index += coords[i] * n ** i;
  }
  return index;
}
function ndpoint(index, n, d) {
  const coords = [index % n];
  const rem = [];
  let r = index - index % n;
  for (let i of this.range(d - 1, 0)) {
    if (n ** i <= r) {
      rem.unshift(Math.floor(r / n ** i));
      r = r % n ** i;
    } else {
      rem.unshift(0);
    }
  }
  return coords.concat(rem);
}
function nth(a, n) {
  if (n < 0) {
    return a[a.length + n];
  } else {
    return a[n];
  }
}
function property(key) {
  return (o) => {
    return o[key];
  };
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function range(start, end, step) {
  let a = [];
  if (!step)
    step = 1;
  if (start > end) {
    step *= -1;
    for (let i = start; i > end; i += step) {
      a.push(i);
    }
  } else {
    for (let i = start; i < end; i += step) {
      a.push(i);
    }
  }
  return a;
}
function remove(a, rule) {
  const list = [];
  for (const item of a) {
    if (!rule(item)) {
      list.push(item);
    }
  }
  return list;
}
function search(a, item, start, end) {
  if (!start)
    start = 0;
  if (!end)
    end = a.length;
  if (start > end)
    return void 0;
  let mid = Math.floor((start + end) / 2);
  if (this.eq(a[mid], item))
    return mid;
  if (a[mid] > item) {
    return this.search(a, item, start, mid - 1);
  } else {
    return this.search(a, item, mid + 1, end);
  }
}
function shuffle(a, n) {
  if (!n || n < 1)
    n = 1;
  for (let i of this.range(0, n)) {
    a.push(a.shift());
  }
  return a;
}
function subtract(target, ...arrays) {
  let sub = [];
  for (const a of arrays) {
    sub = sub.concat(a);
  }
  return target.filter((x) => {
    return !this.includes(sub, x);
  });
}
function times(n, fn) {
  let a = [];
  for (let i = 0; i < n; i++) {
    a.push(fn());
  }
  return a;
}
function unique(a) {
  const c = [];
  for (let i = 0; i < a.length; i++) {
    if (!this.includes(c, a[i]))
      c.push(a[i]);
  }
  return c;
}
function unite(...arrays) {
  let unision = [];
  for (const a of arrays) {
    unision = unision.concat(a);
  }
  return unision;
}
function zip(...arrays) {
  let zipped = [];
  for (let i = 0; i < arrays[0].length; i++) {
    const items = [];
    for (const a of arrays) {
      items.push(a[i]);
    }
    zipped.push(items);
  }
  return zipped;
}
function eq(...items) {
  for (let i = 0; i < items.length - 1; i++) {
    if (items[i] !== items[i + 1]) {
      if (type(items[i]) === type(items[i + 1])) {
        if (type(items[i]) === 1) {
          for (let j = 0; j < Math.max(items[i].length, items[i + 1].length); j++) {
            if (!this.eq(items[i][j], items[i + 1][j]))
              return false;
          }
        } else if (type(items[i]) === 2) {
          if (Object.keys(items[i]).length === Object.keys(items[i + 1]).length) {
            for (const [key, value] of Object.entries(items[i])) {
              if (items[i + 1][key] !== value && !this.eq(items[i + 1][key], value))
                return false;
            }
          } else {
            return false;
          }
        } else if (type(items[i]) === 3) {
          if (items[i].toLowerCase() !== items[i + 1].toLowerCase())
            return false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}
function factors(n) {
  if (Math.abs(n) === 1)
    return [1, n];
  const a = [1, n, -1, -n];
  for (let i of this.range(2, Math.floor(Math.sqrt(Math.abs(n))) + 1)) {
    if (n % i === 0) {
      a.push(i, n / i, -i, -n / i);
    }
  }
  return a;
}
function perfectsq(n) {
  return this.nth(this.factors(n), -1) === this.nth(this.factors(n), -2);
}
function prime(n) {
  return this.factors(n).length === 4;
}
function fromPairs(a) {
  let o = {};
  for (const item of a) {
    o[item[0]] = item[1];
  }
  return o;
}
function mapKeys(o, rule) {
  let thing = {};
  for (const [key, value] of Object.entries(o)) {
    thing[rule(key, o[key])] = o[key];
  }
  return thing;
}
function mapValues(o, rule) {
  let thing = {};
  for (const [key, value] of Object.entries(o)) {
    thing[key] = rule(o[key]);
  }
  return thing;
}
function compare(rule) {
  return (s) => {
    if (s.length !== rule.length)
      return false;
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== rule[i] && rule[i] !== "?")
        return false;
    }
    return true;
  };
}
export {
  choice,
  chunk,
  compare,
  countif,
  distill,
  eq,
  exclude,
  factors,
  filter,
  find,
  findIndexes,
  fromPairs,
  ifelse,
  includes,
  indexes,
  insert,
  intersect,
  iterate,
  last,
  mapKeys,
  mapValues,
  matches,
  matchesProperty,
  must,
  ndarray,
  ndindex,
  ndpoint,
  nth,
  perfectsq,
  prime,
  property,
  random,
  range,
  remove,
  search,
  shuffle,
  subtract,
  times,
  unique,
  unite,
  zip
};