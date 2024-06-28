const readline = require('readline');
function lexer(input) {
    const tokens = [];
    let cursor = 0;
    
    while (cursor < input.length) {
        let char = input[cursor];

        if (/\s/.test(char)) {
            cursor++;
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let word = '';

            while (/[a-zA-Z]/.test(char) ) {
                word += char;
                char = input[++cursor];
            }

            if (word === 'hai' || word === 'likh') {
                tokens.push({ type: 'keyword', value: word });
            } else {
                tokens.push({ type: 'identifier', value: word });
            }

            continue;
        }

        if (/[0-9]/.test(char)) {
            let num = '';
            while (/[0-9]/.test(char)) {
                num += char;
                char = input[++cursor];
            }
            tokens.push({ type: 'number', value: parseInt(num) });
            continue;
        }

        if (/[\+\-\*\/=]/.test(char)) {
            tokens.push({ type: 'operator', value: char });
            cursor++;
            continue;
        }

        
    }

    return tokens
}



function parser(tokens){
    const ast ={
        type: 'Program',
        body: []
    };
    while (tokens.length > 0) {
        let token = tokens.shift();
        if(token.type === 'keyword' && token.value === 'hai'){
            let declaration ={
                type: 'Declaration',
                name: tokens.shift().value,
                value:null,

            }
            if(tokens[0].type === 'operator' && tokens[0].value === '='){
                tokens.shift();
                let expression ='';
                while(tokens.length >0 && tokens[0].type !== 'keyword'){
                    expression += tokens.shift().value;
                   
                }
                declaration.value = expression.trim();
                
            }
            ast.body.push(declaration);
        }
        if(token.type === 'keyword' && token.value === 'likh'){
            ast.body.push({
                type: 'Print',
                expression: tokens.shift().value
            });
        }
    }return ast;
}

function codeGen(node){

    if(node.type === 'Program'){
        return node.body.map(codeGen).join('\n');
    }
    if(node.type === 'Declaration'){
        return `const ${node.name} = ${node.value};`;
    }
    if(node.type === 'Print'){
        return `console.log(${node.expression});`;
    }

}
function compiler(input) {
    const tokens = lexer(input);
    const ast = parser(tokens);
    const executableCode = codeGen(ast); 
    return executableCode;
}
function runner(input) {
    eval(input);
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];

console.log("Enter your code (type 'END' on a new line to finish):");

rl.on('line', (input) => {
    if (input === 'END') {
        rl.close();
    } else {
        lines.push(input);
    }
});

rl.on('close', () => {
    const code = lines.join('\n');
    try {
        const exec = compiler(code);
        runner(exec);
    } catch (e) {
        console.error(e.message);
    }
});




