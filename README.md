# jexer

`jexer` is a lexer. `jexer` is _not_ a lexer generator.

## A quick lesson in compilation

A _scanner_ converts a file into a sequence of characters. (You can rely on
Node's `fs` module for this stage.)

A _lexer_ converts a sequence of characters into a sequence of _tokens_, using
a defined set of rules. (This is what `jexer` does).

A _parser_ builds a sequences of tokens into an _abstract syntax tree_, using a
defined set of rules. (I recommend `jarser` for this stage: 
[`jarser` on npm](https://npmjs.com/jarser)
[`jarser` on GitHub](https://github.com/MichaelBuhler/jarser) )

The abstract syntax tree is then converted into the target code. (This is the
fun part that you get to do yourself! Check out `c.js` as an example:
[`c.js` on GitHub](https://github.com/MichaelBuhler/jarser))

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

#### Jexer.addRule([state,] regex, [tokenName [, newState]])

* `state` \<string> the state where this rule applies
* `regex` \<string> | \<RegExp> the pattern which will match this rule
* `tokenName` \<string> the name of the token that this rule matches
* `newState` \<string> the new state to enter when this rule is matched

#### Jexer.tokenize(sourceCode)

* `sourceCode` \<string> the source code to lex
* returns \<Array\<Token>>

### The `Token` object

A `Token` is a 'plain old javascript object' with these keys:

* `name` \<any> the name of the token
* `text` \<string> the text that was matched
* `line` \<integer> the line number of the first character of the token
* `column` \<integer> the column number of the first character of the token

