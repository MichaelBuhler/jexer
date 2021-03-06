module.exports.Jexer = class Jexer {
    state = 'INITIAL';
    rulesByState = {};

    addRule (state, pattern, tokenName, newState) {
        if ( state instanceof RegExp ) {
            newState = tokenName;
            tokenName = pattern;
            pattern = state;
            state = 'INITIAL';
        }
        if (!this.rulesByState[state]) this.rulesByState[state] = [];
        pattern = pattern.toString();
        console.log('Adding rule with pattern '+pattern+' to state \''+state+'\'');
        const indexOfLastSlash = pattern.lastIndexOf('/');
        const flags = pattern.substring(indexOfLastSlash+1);
        pattern = '^'+pattern.substring(1,indexOfLastSlash)+'$';
        this.rulesByState[state].push({
            pattern: RegExp(pattern, flags),
            tokenName: tokenName,
            nextState: newState
        });
    }

    tokenize (sourceCode) {
        if ( sourceCode.length === 0 ) {
            return [];
        }
        let line = 1, column = 1;
        const tokens = [];
        const chars = Array.from(sourceCode);
        let prev_text = '', text = '';
        let prev_matched_rules = [], matched_rules = [];
        let token_line = 1, token_column = 1;
        for ( let i = 0 ; i < chars.length ; i++ ) {
            const char = chars[i];
            text = prev_text + char;
            if ( text.length === 1 ) {
                token_line = line;
                token_column = column;
            }
            matched_rules = this.rulesByState[this.state].filter(function (rule) {
                return rule.pattern.test(text);
            });
            console.log('match: '+JSON.stringify(text)+' matched '+matched_rules.length+' rule(s) in state \''+this.state+'\'');
            if ( matched_rules.length === 0 ) {
                if ( prev_matched_rules.length === 0 ) {
                    throw new Error('No matching rule for '+JSON.stringify(text)+' at line '+token_line+', column '+token_column);
                } else {
                    let tokenName = prev_matched_rules[0].tokenName;
                    if ( typeof tokenName === 'function' ) {
                        tokenName = tokenName(prev_text, token_line, token_column);
                    }
                    console.log('token: '+tokenName+' '+JSON.stringify(prev_text));
                    if (tokenName) {
                        tokens.push({
                            name: tokenName,
                            text: prev_text,
                            line: token_line,
                            column: token_column
                        });
                    }
                    this.state = prev_matched_rules[0].nextState || this.state;
                    prev_text = text = '';
                    prev_matched_rules = matched_rules = [];
                    i--;
                    continue;
                }
            } else {
                prev_text = text;
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
            throw new Error('No matching rule for \''+text+'\' at line '+token_line+', column '+token_column);
        } else {
            let tokenName = matched_rules[0].tokenName;
            if (typeof tokenName === 'function') {
                tokenName = tokenName(text, token_line, token_column);
            }
            console.log('token: '+tokenName+' '+JSON.stringify(text));
            if (tokenName) {
                tokens.push({
                    name: tokenName,
                    text: text,
                    line: token_line,
                    column: token_column
                });
            }
        }
        return tokens;
    }
}
