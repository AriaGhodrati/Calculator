let str = "";

function appendDigitsButtons (digit){
    str += digit;
    const ta_input = document.getElementById("calculator_input");
    if (ta_input){
        ta_input.value = str;
    }
}

function appendOperatorButtons (operator){
    str += operator;
    const ta_input = document.getElementById("calculator_input");
    if (ta_input){
        ta_input.value = str;
    }
}

// function showAnswer (answer){
//     document.getElementById("calculator_output").innerHTML = answer;
// }


document.addEventListener("DOMContentLoaded", function() {
    const digits = document.querySelectorAll("button.number_digits");
    digits.forEach((number_btn) => {
        number_btn.addEventListener("click", function() {
            const value = number_btn.innerText || number_btn.textContent;
            appendDigitsButtons(value.trim());
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const operators = document.querySelectorAll("button.operator_button");
    operators.forEach((oper_btn) => {
        oper_btn.addEventListener("click", function() {
            const value = oper_btn.innerText || oper_btn.textContent;
            appendOperatorButtons(value.trim());
        });
    });
});


document.addEventListener("DOMContentLoaded", function(){
    const equal = document.getElementById("equal_button");
    const ta_input = document.getElementById("calculator_input");
    // const del = document.getElementById("equal_button");

    equal.addEventListener("click", function(){
        str = ta_input.value;
        let tokens = tokenize(str);
        let evaluated = evaluatePostfix(InfixToPostfix(tokens));
        document.getElementById("calculator_output").innerText = evaluated;
    });

    // del.addEventListener("click", function(){
    //     let arr = str.split("");
    //     str = arr.pop();
    // });
});


document.addEventListener("DOMContentLoaded", function(){
    const del = document.getElementById("backspace_button");
    const ta_input = document.getElementById("calculator_input");
    if (!del || !ta_input) return;

    del.addEventListener("click", function(e){
        e.preventDefault(); 
        if (str.length > 0){
            str = str.slice(0, -1);
            ta_input.value = str || ""; 
            // ta_input = str;
            ta_input.focus();
        }
    });
});


document.addEventListener("DOMContentLoaded", function(){
    const ac = document.getElementById("all_clear_button");
    ta_input = document.getElementById("calculator_input");
    output_area = document.getElementById("calculator_output");
    
    ac.addEventListener("click", function(e){
        if (str.length > 0){
            e.preventDefault();
            str = ""; 
            ta_input.value = "";
            output_area.innerHTML = ""; 
            ta_input.focus();        
        }
    });
});


function tokenize(expr) {
    let tokens = [];
    let numberBuffer = [];

    for (let char of expr) {
        if (!isNaN(char) && char !== " ") {
            // اگر عدد هست، توی numberBuffer ذخیره کن
            numberBuffer.push(char);
        } else {
            // اگر عملگر رسیدی و numberBuffer پره → تبدیلش کن به عدد
            if (numberBuffer.length > 0) {
                tokens.push(numberBuffer.join(""));
                numberBuffer = [];
            }
            if (char.trim() !== "") { // حذف فاصله‌ها
                tokens.push(char);
            }
        }
    }

    // اگر در انتها عدد مونده بود
    if (numberBuffer.length > 0) {
        tokens.push(numberBuffer.join(""));
    }

    return tokens;
}


function InfixToPostfix (tokenString){
    let stck = [];
    let output = [];
    const operators = {"+":1, "-":1, "*":2, "/":2};
    // تعیین Associativity (جهت اجرا)
    // const rightAssociative = { "^": true, "√": true };
    // for (let token of tokenString){
    //     if (!isNaN(token)){
    //         output.push(token);
    //     }
    //     else if (token in operators){
    //         // بررسی اولیت
    //         while (stck.length && stck[stck.length-1] in operators)
    //     }
    // }
    // for (const token of tokenString) {
    //     if (!stck.length && isNaN(token)){
    //         stck.push(token)
    //     }
    //     else if (isNaN(token)){
    //         stck.push(token)
    //     } else {output.push(token)}
    // }
    
    let counter = 0;
    while (counter < tokenString.length){
        let token = tokenString[counter];
        
         if (!isNaN(token)) {   // if token is number
            output.push(token);
        }
        else if (token === "(") {   // if it was "("
            stck.push(token);
        }
        // else if (isNaN(token) && token !== ")"){   // if it is not ")"
        //     stck.push(token);
        // }
        else if (token in operators){   // while the stack isn't empty and there is a higher precedence operator on top of the stack and there is no "(".
            while (operators[stck[stck.length-1]] >= operators[token] && stck[stck.length-1] in operators && stck.length){
                output.push(stck.pop());
            }
            
            // now push the operator
            stck.push(token);
        }
        else if (token === ")"){   // if there was ")".
            while (stck.length && stck[stck.length - 1] !== "(") {   // while it gets to "(", pop all of the operators from the stack
                output.push(stck.pop());
            }
            if (stck.length && stck[stck.length - 1] === "(") {   // pop the "(" from the stack but do not push it into output.
                stck.pop();
            } else {
                throw new Error()
            }
        }
        
        counter++;
    }

    while (stck.length){
        let top = stck.pop();
        if (top === "(" || top === ")") {
            throw new Error("Mismatched parentheses!");
        }
        output.push(top);
    }

    return output;

}


// let tokens = ["3", "+", "5", "*", "(", "2", "-", "8", ")"];
// let postfix = InfixToPostfix(tokens);

// console.log([postfix.join(" ")]);
// خروجی: 3 5 2 8 - * +

function evaluatePostfix(postfixTokens) {
    stck = [];
    
    for (const token of postfixTokens) {
        if (!isNaN(token)){
            stck.push(Number(token));
        } else {
            if (stck.length < 2) {
                throw new Error("Invalid postfix expression: not enough operands.");
            }
            let temp1 = stck.pop();
            let temp2 = stck.pop();
            let holdingTemp;

            switch (token){
                case "+":
                    holdingTemp = temp2 + temp1;
                    stck.push(holdingTemp);
                    break;   
                case "-":
                    holdingTemp = temp2 - temp1;
                    stck.push(holdingTemp);
                    break;
                case "*":
                    holdingTemp = temp2 * temp1;
                    stck.push(holdingTemp);
                    break;
                case "/":
                    holdingTemp = temp2 / temp1;
                    stck.push(holdingTemp);
                    break;    
            }
            
        }
    }
    if (stck.length !== 1) {
        throw new Error("Invalid postfix expression: too many operands.");
    }
    return stck.pop();
}

// let postfix = ["3", "4", "2", "*", "+"];
// console.log(evaluatePostfix(postfix)); 

// let postfix2 = ["5", "2", "-", "8", "4", "/", "*"];
// console.log(evaluatePostfix(postfix2)); 
