# Pure-functional Red-Black Tree Map for JavaScript

`rbt` is a bare-minimum implmentation of functional red-black tree in
JavaScript.

# Usage

## Node.js

~~~shell
npm install rbt
~~~

Then require it.

~~~javascript
var rbtree = require('rbt');
var map1 = rbtree.fromObject({a:1, b:2, c:3});
var map2 = map1.set('b', 50);
map1.get('b'); // 2
map2.get('b'); // 50
~~~

## Browser

~~~html
<script src="dist/rbt.min.js"></script>
<script>
    var map1 = rbtree.fromObject({a:1, b:2, c:3});
    var map2 = map1.get('b',50);
    map1.get('b'); // 2
    map2.get('b'); // 50
</script>
~~~

Also see [spec](spec/rbt.spec.js).

# API

Use the [source](rbt.js), Luke!

- static `fromObject`
- static `empty`
- `has`
- `add`
- `get`
- `count`
- `iter`
- `map`
- `reduce`
- `toObject`
