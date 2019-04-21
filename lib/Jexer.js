function Jexer () {
    this.state = 'INITIAL';
    this.rules = {};
}

Jexer.prototype.rule = function (a, b, c, d) {
    if ( a instanceof RegExp ) {
        d = c;
        c = b;
        b = a;
        a = 'INITIAL';
    }
    if (!this.rules[a]) this.rules[a] = [];
    let pattern = b.toString();
    console.log('Adding rule with pattern '+pattern+' to state \''+a+'\'');
    const indexOfLastSlash = pattern.lastIndexOf('/');
    const flags = pattern.substring(indexOfLastSlash+1);
    pattern = '^'+pattern.substring(1,indexOfLastSlash)+'$';
    this.rules[a].push({
        pattern: RegExp(pattern, flags),
        tokenName: c,
        nextState: d
    });
};

Jexer.prototype.tokenize = function (sourceCode) {
    let line = 1, column = 1;
    const tokens = [];
    const chars = Array.from(sourceCode);
    let prev_yytext = '', yytext = '';
    let prev_matched_rules = [], matched_rules = [];
    let token_line = 1, token_column = 1;
    for ( let i = 0 ; i < chars.length ; i++ ) {
        const char = chars[i];
        yytext = prev_yytext + char;
        if ( yytext.length === 1 ) {
            token_line = line;
            token_column = column;
        }
        matched_rules = this.rules[this.state].filter(function (rule) {
            return rule.pattern.test(yytext);
        });
        console.log('match: '+JSON.stringify(yytext)+' matched '+matched_rules.length+' rule(s) in state \''+this.state+'\'');
        if ( matched_rules.length === 0 ) {
            if ( prev_matched_rules.length === 0 ) {
                throw new Error('No matching rule for '+JSON.stringify(yytext)+' at line '+token_line+', column '+token_column);
            } else {
                let tokenName = prev_matched_rules[0].tokenName;
                if ( typeof tokenName === 'function' ) {
                    tokenName = tokenName(prev_yytext, token_line, token_column);
                }
                console.log('token: '+tokenName+' '+JSON.stringify(prev_yytext));
                if (tokenName) {
                    tokens.push({
                        name: tokenName,
                        text: prev_yytext,
                        line: token_line,
                        column: token_column
                    });
                }
                this.state = prev_matched_rules[0].nextState || this.state;
                prev_yytext = yytext = '';
                prev_matched_rules = matched_rules = [];
                i--;
                continue;
            }
        } else {
            prev_yytext = yytext;
            prev_matched_rules = matched_rules;
        }
        if ( char === '\n' ) {
            line++;
            column = 1;
        } else {
            column++;
        }
    }
    if ( matched_rules.length === 0 ) {
        throw new Error('No matching rule for \''+yytext+'\' at line '+line+', column '+column);
    } else {
        let type = matched_rules[0].tokenName;
        if (typeof type === 'function') {
            type = type(yytext, 0, 0);
        }
        console.log('token: yytext \'' + yytext + '\' matched as token \'' + type + '\'');
        if (type) {
            tokens.push({
                type: type,
                yytext: yytext
            });
        }
    }
    return tokens;
};

module.exports = Jexer;
