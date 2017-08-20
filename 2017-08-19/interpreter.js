/*
GRAMMAR
expr: term ((plus|minus) term)*
term: factor ((times/div) factor)*
factor: integer
      | lparen expr rparen
integer: digit digit*

NOTE: technically the result will be a float like all numbers in JS
*/

// Use `undefined` for nil ie optional value

var Token = function(char, kind) {
    this.char = char;
    this.kind = kind;
}

var Integer = function(digits) {
    this.number = parseInt(digits);
    this.value = function() {
        return this.number;
    }
}

var Factor = function(expr) {
    this.expr = expr;
    this.value = function() {
        return this.expr.value();
    }
}

var Term = function(lhs, op, rhs) {
    this.lhs = lhs;
    this.op = op;
    this.rhs = rhs;
    this.value = function() {
        if (this.lhs === undefined) {
            if (this.rhs === undefined) {
                throw "Both operands of this term are undefined"
            } else {
                return this.rhs.value();
            }
        } else {
            if (this.rhs === undefined) {
                return this.lhs.value();
            } else {
                var l = this.lhs.value();
                var r = this.rhs.value();
                switch (this.op.kind) {
                    case "TIMES":
                        return l * r;
                        break;
                    case "DIV":
                        return l / r;
                        break;
                    default:
                        throw "Invalid operand in term: " + this.op;
                        break;
                }
            }
        }
    }
}

var Expr = function(lhs, op, rhs) {
    this.lhs = lhs;
    this.op = op;
    this.rhs = rhs;
    this.value = function() {
        if (this.lhs === undefined) {
            if (this.rhs === undefined) {
                throw "Both operands of this expr are undefined"
            } else {
                return this.rhs.value();
            }
        } else {
            if (this.rhs === undefined) {
                return this.lhs.value();
            } else {
                var l = this.lhs.value();
                var r = this.rhs.value();
                switch (this.op.kind) {
                    case "PLUS":
                        return l + r;
                        break;
                    case "MINUS":
                        return l - r;
                        break;
                    default:
                        console.log(this.op);
                        throw "Invalid operand in expr: " + this.op;
                        break;
                }
            }
        }
    }
}

function parse(input) {
    var tokens = new Array();
    for (var i = 0; i < input.length; i++) {
        var char = input.charAt(i);
        var kind = "UNKNOWN";
        var charCode = char.charCodeAt(0);
        var opKinds = ["TIMES", "PLUS", "UNKNOWN", "MINUS", "UNKNOWN", "DIV"];
        // 0: 48, 9: 57
        if (48 <= charCode && charCode <= 57) {
            kind = "DIGIT";
        } else if (charCode == 40) {
            kind = "LPAREN";
        } else if (charCode == 41) {
            kind = "RPAREN";
        } else {
            // 42
            // * + ? - ?  /
            charCode -= 42;
            kind = opKinds[charCode];
        }
        tokens.push(new Token(char, kind));
    }
    tokens.push(new Token("", "EOF"));
    return tokens;
}

var Interpreter = function(tokens) {
    if (tokens.length < 1) {
        throw "Empty token list";
    }
    this.tokens = tokens;
    this.currentToken = tokens[0];
    this.currentIndex = 0;
    this.tree = null;

    this.eat = function(kind) {
        if (this.currentToken.kind == kind) {
            var result = this.currentToken;
            this.currentIndex++;
            this.currentToken = this.tokens[this.currentIndex];
            return result;
        } else {
            throw "Expected " + kind + ", found " + this.currentToken.kind;
        }
    }

    this.handleInteger = function() {
        var digits = "";
        while (this.currentToken.kind == "DIGIT") {
            var digit = this.eat("DIGIT");
            digits += digit.char;
        }
        if (digits.length < 1) {
            throw "No integer found";
        }
        return new Integer(digits);
    }

    this.handleFactor = function() {
        if (this.currentToken.kind == "DIGIT") {
            return this.handleInteger();
        } else if (this.currentToken.kind == "LPAREN") {
            this.eat("LPAREN");
            var e;
            try {
                e = this.handleExpr();
            } catch (err) {
                throw "No factor found: " + err;
            }
            this.eat("RPAREN");
            return e;
        } else {
            throw "Expected factor, found: " + this.currentToken.kind;
        }
    }

    this.handleTerm = function() {
        var lhs;
        var rhs;
        var op;
        try {
            lhs = this.handleFactor();
            // console.log(this.currentToken)
            if (this.currentToken.kind == "TIMES" || this.currentToken.kind == "DIV") {
                op = this.currentToken;
                this.eat(op.kind);
                // console.log("op: " + op);
                rhs = this.handleFactor();
                // console.log("rhs: " + rhs);
                return new Term(lhs, op, rhs);
            }
            return lhs;
        } catch (err) {
            throw "No term found: " + err;
        }
    }

    this.handleExpr = function() {
        var lhs;
        var rhs;
        var op;
        try {
            lhs = this.handleTerm();
            if (this.currentToken.kind == "PLUS" || this.currentToken.kind == "MINUS") {
                op = this.currentToken;
                this.eat(op.kind);
                // console.log("op: " + op);
                rhs = this.handleTerm();
                // console.log("rhs: " + rhs);
                return new Expr(lhs, op, rhs);
            }
            return lhs;
        } catch (err) {
            throw "No expr found: " + err;
        }
    }

    this.evaluate = function() {
        this.tree = this.handleExpr();
        while (this.currentToken.kind != "EOF") {
            if (this.currentToken.kind == "PLUS" || this.currentToken.kind == "MINUS") {
                var lhs = this.tree;
                var op = this.currentToken;
                this.eat(op.kind);
                var rhs = this.handleExpr();
                this.tree = new Expr(lhs, op, rhs);
            } else if (this.currentToken.kind == "TIMES" || this.currentToken.kind == "DIV") {
                var lhs = this.tree;
                var op = this.currentToken;
                this.eat(op.kind);
                var rhs = this.handleExpr();
                this.tree = new Term(lhs, op, rhs);
            } else {
                throw "What? " + this.currentToken.kind;
            }
        }
    }
}
