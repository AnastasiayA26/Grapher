// let {get_parser} = require('./_math_parser.js');

import lark from './_math_parser.js';
let {get_parser} = lark;

let transformer = {
    number: ([n]) => function (x) { return parseFloat(n.value); },
    var: ([s])  => function (x) { return x; }, // TODO: every variable is considered to be the same as x
    expr_binary:  function ([lhs, {value: op}, rhs]) {
        console.log(lhs, op, rhs);
        switch (op) {
            case "+": return function (x) { return lhs(x) + rhs(x); };
            case "-": return function (x) { return lhs(x) - rhs(x); };
            case "*": return function (x) { return lhs(x) * rhs(x); };
            case "/": return function (x) { return lhs(x) / rhs(x); };
        }
    },
    expr_func_call:  function ([{value: name}, ...rhs]) {
        console.log(name, rhs);
        switch (name) {
            case "min": return function (x) { return Math.min(rhs[0](x), rhs[1](x)); };
            case "max": return function (x) { return Math.max(rhs[0](x), rhs[1](x)); };
            case "log": return function (x) { return Math.log(rhs[0](x)); };
            case "sin": return function (x) { return Math.sin(rhs[0](x)); };
            case "cos": return function (x) { return Math.cos(rhs[0](x)); };
        }
    }
};

let parser = get_parser({transformer});

export function make_function(expr) {
    console.log(JSON.stringify(parser.parse(expr), null, 4));
    return parser.parse(expr);
}

