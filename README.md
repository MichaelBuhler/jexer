# jexer

`jexer` is a lexer. `jexer` is _not_ a lexer generator.

## A quick lesson in compilation

A _scanner_ converts a file into a sequence of characters. (If using Node.js,
you can rely on the built-in `fs` modules for this.)

A _lexer_ (or _tokenizer_) parses a sequence of characters into a sequence of
_tokens_, using a defined set of rules. (This is what `jexer` does).

A _parser_ parses a sequence of tokens into an _abstract syntax tree_, using a
defined set of rules. (I recommend `jarser` for this stage: 
[`jarser` on npm](https://npmjs.com/jarser)
[`jarser` on GitHub](https://github.com/MichaelBuhler/jarser) )

The abstract syntax tree is then converted into the target code. (This is the
fun part that you get to do yourself! Check out `c.js` as an example:
[`c.js` on GitHub](https://github.com/MichaelBuhler/c.js))

## Installation

Install `jexer` with npm.

```bash
$ npm install [--save] jexer
```

## Usage

```js
const Jexer = require('jexer');
const jexer = new Jexer();
jexer.addRule(...);
const tokens = jexer.tokenize('string of source code');
```

## API

### The `Jexer` object

#### new Jexer()

* Returns an instance of `Jexer`.

#### Jexer.addRule([state,] pattern, [tokenName [, newState]])

* `state` \<string> **Default:** `'INITIAL'` (the initial/default state)
* `pattern` \<RegExp>
* `tokenName` \<string> | \<Function> **Default:** `undefined` (swallow token)
  * `text` \<string>
  * `line` \<integer>
  * `column`  \<integer>
* `newState` \<string> **Default:** `undefined` (do not change state)

Add a rule to the lexer. A match `pattern` is required.

If a `state` is provided, the rule only applies to the state specified. If no
`state` is provided, the rule only applies in the initial/default state, which
is `'INITIAL'`.

If `tokenName` is a `string`, the lexed token is added to the output with the
given name.

If `tokenName` is a `function`, it is called with three arguments `(text, line,
column)`, where `test` is the text that matched the rule's pattern and `line`
and `column` indicate the position of the text within the source code that is
being tokenized. The function should return a `tokenName`; functions without
return values (equivalent to `return undefined;`) result in the token being
swallowed. Passing a function is useful for debugging, logging, or for
validating state. Throwing an error in this function halts execution of the
lexer.

If `tokenName` is `undefined`, whether implicitly or explicitly,
the token is swallowed and omitted from the output. If you want to swallow a
token _and_ enter a `newState`, you must explicitly pass `undefined` for
`tokenName`.

If `newState` if provided, the lexer will enter this state after this rule is
matched. Pass `'INITIAL'` to return to the default/initial state.

#### Jexer.tokenize(sourceCode)

* `sourceCode` \<string>
* returns \<Array\<Token>>

Returns an `Array` of `Token` objects.

Throws an `Error` if there is a problem parsing the source code, i.e. if the
lexer encounters text that doesn't match any defined rules.

### The `Token` object

A `Token` is a 'plain old javascript object' with these keys:

* `name` \<any> the name of the token
* `text` \<string> the text that was matched
* `line` \<integer> the line number of the first character of the token
* `column` \<integer> the column number of the first character of the token

