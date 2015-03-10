/* @flow */

(function (root     ) {
"use strict";

                    
                                  

var RED = 0, BLACK = 1;


               
                
                 
              
           

  function Tree(color       , left         , key        , value   , right)          {
    this.color = color;
    this.left = left;
    this.right = right;
    this.key = key;
    this.value = value;
  }

  Tree.prototype.has=function(key)                  {
    if (key < this.key) {
      return this.left.has(key);
    } else if (key > this.key) {
      return this.right.has(key);
    } else {
      return true;
    }
  };

  Tree.prototype.add=function(key        , value)             {
    if (key < this.key) {
      return this.$Tree_balance(
        this.color,
        this.left.add(key, value),
        this.key,
        this.value,
        this.right
      );
    } else if (key > this.key) {
      return this.$Tree_balance(
        this.color,
        this.left,
        this.key,
        this.value,
        this.right.add(key, value)
      );
    } else {
      return new Tree(this.color, this.left, this.key, value, this.right);
    }
  };

  Tree.prototype.$Tree_balance=function(color       , left         , key        , value   , right)                   {
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
  };

  Tree.prototype.get=function(key)             {
    if (key < this.key) {
      return this.left.get(key);
    } else if (key > this.key) {
      return this.right.get(key);
    } else {
      return this.value;
    }
  };

  Tree.prototype.count=function()         {
    return this.left.count() + 1 + this.right.count();
  };

  Tree.prototype.iter=function(fn)                                  {
    this.left.iter(fn);
    fn(this.key, this.value);
    this.right.iter(fn);
  };

  Tree.prototype.map=function(fn)                                  {
    var left = this.left.map(fn),
        value = fn(this.key, this.value),
        right = this.right.map(fn);
    return new Tree(this.color, left, this.key, value, right);
  };

  Tree.prototype.reduce=function(fn                                , acc)       {
    acc = this.left.reduce(fn, acc);
    acc = fn(this.key, this.value, acc);
    return this.right.reduce(fn, acc);
  };

  Tree.prototype.toObject=function()         {
    var obj = {};
    this.iter(function (k, v) { obj[k] = v; });
    return obj;
  };


function Empty(){}
  Empty.prototype.has=function(key)                  {
    return false;
  };

  Empty.prototype.add=function(key        , value)             {
    return new Tree(RED, empty, key, value, empty);
  };

  Empty.prototype.get=function(key)             {
    return null;
  };

  Empty.prototype.count=function()         {
    return 0;
  };

  Empty.prototype.iter=function(fn)                                  {};
  Empty.prototype.map=function(fn)                                  { return this; };
  Empty.prototype.reduce=function(fn                                , acc)       { return acc; };

  Empty.prototype.toObject=function()         {
    return {};
  };


var empty = new Empty();

function fromObject(obj        )            {
  var t = empty;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      t = t.add(key, obj[key]);
    }
  }
  return t;
}

var moduleObj      = {
  empty: empty,
  RBTree: Tree,
  fromObject: fromObject,
};

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = moduleObj;
  } else {
    root.rbtree = moduleObj;
  }
}

})(this);
