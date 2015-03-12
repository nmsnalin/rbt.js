if (typeof rbtree === 'undefined') {
  var rbtree = require('../dist/rbt');
}

describe('rbtree', function () {
  it('is empty initially', function () {
    expect(rbtree.empty.toObject()).toEqual({});
  });

  it('can add new elements', function () {
    var empty = rbtree.empty,
        single = empty.add('foo', 42);
    expect(single.toObject()).toEqual({ foo: 42 });
  });

  it('does not add in-place', function () {
    var t1 = rbtree.empty,
        t2 = t1.add('foo', 1),
        t3 = t2.add('bar', 2);
    expect(t1).toBe(rbtree.empty);
    expect(t2).toEqual(t2);
    expect(t3.toObject()).toEqual({ foo: 1, bar: 2 });
  });

  it('does not mutate in-place', function () {
    var t1 = rbtree.empty.add('foo', 1).add('bar', 2);
        t2 = t1.add('foo', 42),
    expect(t1.get('foo')).toBe(1);
    expect(t2.get('foo')).toBe(42);
  });

  it('can tell membership of key', function () {
    var t = rbtree.empty.add('foo', 1).add('bar', 2);
    expect(t.has('foo')).toBe(true);
    expect(t.has('bar')).toBe(true);
    expect(t.has('baz')).toBe(false);
  });

  it('can get value by key', function () {
    var t = rbtree.empty.add('foo', 1).add('bar', 2);
    expect(t.get('foo')).toBe(1);
    expect(t.get('bar')).toBe(2);
    expect(t.get('baz')).toBe(null);
  });

  it('can be iterated over keys and values in ascending order', function () {
    var pairs = [],
        empty = rbtree.empty,
        t = empty.add('foo', 1).add('bar', 2).add('baz', 3).add('quux', 4);
    t.iter(function (k, v) { pairs.push([k, v]); });
    expect(pairs).toEqual([
      ['bar', 2],
      ['baz', 3],
      ['foo', 1],
      ['quux', 4],
    ]);
  });

  it('values can be mapped', function () {
    var pairs = [],
        empty = rbtree.empty,
        t1 = empty.add('foo', 1).add('bar', 2).add('baz', 3).add('quux', 4);
        t2 = t1.map(function (k, v) { return v + 1 });
    expect(t2.toObject()).toEqual({
      'foo': 2,
      'bar': 3,
      'baz': 4,
      'quux': 5,
    })
  });

  it('can be reduce in ascending order', function () {
    var empty = rbtree.empty,
        t = empty.add('foo', 1).add('bar', 2).add('baz', 3).add('quux', 4);
    expect(t.reduce(function (k, v, acc) { return acc + v; }, 0)).toBe(10);
    expect(t.reduce(function (k, v, acc) { return acc + k; }, '')).toBe(
      "barbazfooquux"
    );
  });

  it('can count its elements', function () {
    var empty = rbtree.empty,
        t = empty.add('foo', 1).add('bar', 2).add('baz', 3).add('quux', 4);
    expect(empty.count()).toBe(0);
    expect(t.count()).toBe(4);
  });

  it('can populate entries from Object', function () {
    var t = rbtree.fromObject({a:1, b:2, c:3});
    expect(t.toObject()).toEqual({a:1, b:2, c:3});
  });

  it('can mutate value associated with a key', function () {
    var t = rbtree.fromObject({a:1, b:2, c:3});
    t.set('a', 42);
    expect(t.toObject()).toEqual({a:42, b:2, c:3});
    expect(function () { t.set('d', 4); }).toThrow("invalid key: d");
  });
});
