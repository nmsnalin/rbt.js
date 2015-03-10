/* @flow */

"use strict";

type color = number;
type tree<T> = Tree<T> | Empty<T>;

var RED = 0, BLACK = 1;

class Tree<T> {
  color: color;
  left: tree<T>;
  right: tree<T>;
  key: string;
  value: T;

  constructor(color: color, left: tree<T>, key: string, value: T, right: tree<T>) {
    this.color = color;
    this.left = left;
    this.right = right;
    this.key = key;
    this.value = value;
  }

  has(key: string): boolean {
    if (key < this.key) {
      return this.left.has(key);
    } else if (key > this.key) {
      return this.right.has(key);
    } else {
      return true;
    }
  }

  add(key: string, value: T): tree<T> {
    if (key < this.key) {
      return this._balance(
        this.color,
        this.left.add(key, value),
        this.key,
        this.value,
        this.right
      );
    } else if (key > this.key) {
      return this._balance(
        this.color,
        this.left,
        this.key,
        this.value,
        this.right.add(key, value)
      );
    } else {
      return this;
    }
  }

  _balance(color: color, left: tree<T>, key: string, value: T, right: tree<T>): tree<T> {
    if (color === BLACK) {
      // case 1
      // ------
      //        B
      //       /|\
      //      R z d            R
      //     /|\              /|\
      //    / | \            / | \
      //   R  y  c    =>    B  y  B
      //  /|\              /|\   /|\
      // a x b            a x b c z d
      //
      // case 2
      // ------
      //       B
      //      /|\
      //     R z d              R
      //    /|\                /|\
      //   / | \              / | \
      //  a  x  R     =>     B  y  B
      //       /|\          /|\   /|\
      //      b y c        a x b c z d
      //
      // case 3
      // ------
      //     B
      //    /|\
      //   a x R                R
      //      /|\              /|\
      //     / | \            / | \
      //    R  z  d   =>     B  y  B
      //   /|\              /|\   /|\
      //  b y c            a x b c z d
      //
      // case 4
      // ------
      //    B
      //   /|\
      //  a x R                 R
      //     /|\               /|\
      //    / | \             / | \
      //   b  y  R    =>     B  y  B
      //        /|\         /|\   /|\
      //       c z d       a x b c z d
      //
      if (left instanceof Tree && left.color === RED) {
        if (left.left instanceof Tree && left.left.color === RED) {
          // case 1
          var level2 = left.left,
              l = new Tree(BLACK, level2.left, level2.key, level2.value, level2.right),
              r = new Tree(BLACK, left.right, key, value, right);
          return new Tree(RED, l, left.key, left.value, r);
        } else if (left.right instanceof Tree && left.right.color === RED) {
          // case 2
          var level2 = left.right,
              l = new Tree(BLACK, left.left, left.key, left.value, level2.left),
              r = new Tree(BLACK, level2.right, key, value, right);
          return new Tree(RED, l, level2.key, level2.value, r);
        }
      } else if (right instanceof Tree && right.color === RED) {
        if (right.left instanceof Tree && right.left.color === RED) {
          // case 3
          var level2 = right.left,
              l = new Tree(BLACK, left, key, value, level2.left),
              r = new Tree(BLACK, level2.right, right.key, right.value, right.right);
          return new Tree(RED, l, level2.key, level2.value, r);
        } else if (right.right instanceof Tree && right.right.color === RED) {
          // case 4
          var level2 = right.right;
              l = new Tree(BLACK, left, key, value, right.left);
              r = new Tree(BLACK, level2.left, level2.key, level2.value, level2.right);
          return new Tree(RED, l, right.key, right.value, level2.right);
        }
      }
    }
    return new Tree(color, left, key, value, right);
  }

  get(key: string): ?T {
    if (key < this.key) {
      return this.left.get(key);
    } else if (key > this.key) {
      return this.right.get(key);
    } else {
      return this.value;
    }
  }

  iter(fn: (k: string, v: T) => void): void {
    this.left.iter(fn);
    fn(this.key, this.value);
    this.right.iter(fn);
  }

  map(fn: (k: string, v: T) => T): tree<T> {
    var left = this.left.map(fn),
        value = fn(this.key, this.value),
        right = this.right.map(fn);
    return new Tree(this.color, left, this.key, value, right);
  }

  toObject(): Object {
    var obj = Object.create(null);
    this.iter(function (k, v) { obj[k] = v; });
    return obj;
  }
}

class Empty<T> {
  has(key: string): boolean {
    return false;
  }

  add(key: string, value: T): tree<T> {
    return new Tree(RED, empty, key, value, empty);
  }

  get(key: string): ?T {
    return null;
  }

  iter(fn: (k: string, v: T) => void): void {}
  map(fn: (k: string, v: T) => T): tree<T> { return this; }

  toObject(): Object {
    return Object.create(null);
  }
}

var empty = new Empty();
