// let {get_parser} = require('./_math_parser.js');

import lark from './_math_parser.js';
let {get_parser} = lark;

let transformer = {
    number: function ([n]) {
        const value = parseFloat(n.value);
        return (x) => value;
    },
    var: function ([s]) {
        switch (s.value) {
            case "x": return (x) => x;
            case "pi": return (x) => Math.PI;
            case "e": return (x) => Math.E;
            default: return (x) => NaN;
        }
    },
    expr_unary:  function ([{value: op}, rhs]) {
        switch (op) {
            case "+": return (x) => +rhs(x);
            case "-": return (x) => -rhs(x);
            default: return (x) => NaN;
        }
    },
    expr_binary:  function ([lhs, {value: op}, rhs]) {
        switch (op) {
            case "+": return (x) => lhs(x) + rhs(x);
            case "-": return (x) => lhs(x) - rhs(x);
            case "*": return (x) => lhs(x) * rhs(x);
            case "/": return (x) => lhs(x) / rhs(x);

            case "==": return (x) => lhs(x) == rhs(x);
            case "!=": return (x) => lhs(x) != rhs(x);
            case ">=": return (x) => lhs(x) >= rhs(x);
            case "<=": return (x) => lhs(x) <= rhs(x);
            case ">": return (x) => lhs(x) > rhs(x);
            case "<": return (x) => lhs(x) < rhs(x);

            default: return (x) => NaN;
        }
    },
    expr_func_call:  function ([{value: name}, ...rhs]) {
        console.log(name, rhs);
        switch (name) {
            case "min": return (x) => Math.min(rhs[0](x), rhs[1](x));
            case "max": return (x) => Math.max(rhs[0](x), rhs[1](x));

            case "ln": return (x) => Math.log(rhs[0](x));
            case "log10": return (x) => Math.log(rhs[0](x)) / Math.log(10);
            case "log2": return (x) => Math.log(rhs[0](x)) / Math.log(2);
            case "log": return (x) => Math.log(rhs[1](x)) / Math.log(rhs[0](x));

            case "sin": return (x) => Math.sin(rhs[0](x));
            case "cos": return (x) => Math.cos(rhs[0](x));
            case "tan": return (x) => Math.tan(rhs[0](x));
            case "cot": return (x) => 1 / Math.tan(rhs[0](x));

            case "abs": return (x) => Math.abs(rhs[0](x));
            case "sqrt": return (x) => Math.sqrt(rhs[0](x));

            case "f": return (x) => x;
            case "id": return (x) => x;
            default: return (x) => NaN;
        }
    }
};

let parser = get_parser({transformer});

export function make_function(expr) {
    console.log(JSON.stringify(parser.parse(expr), null, 4));
    return parser.parse(expr);
}

