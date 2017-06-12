$(document).ready(initialize_calculator);

var input_index = 0;
var input = [""];
var num1 = "";
var operator_type = "";
var num2 = "";
var result;


function initialize_calculator(){
    $(".input_button").click(button_pressed);
    $(".operator_button").click(button_pressed);
    $(".c_container").click(button_pressed);
    $(".ce_container").click(button_pressed);
}

function button_pressed(){
    var button_value = $(this).val();
    switch (button_value){
        case "CE":
            if(input[input_index] !== ""){//if CE is pressed after a number
                if(input_index == 0){
                    input.pop();
                    input = [""];
                }
                else{
                    input.pop();
                    input.push("");
                }
            }
            else if(input[input_index] === "" && input_index !== 0){//if CE is pressed after an operator
                input.pop();
                input.pop();
                input_index -= 2;
            }
            $(".output_container div").text(input.join(""));
            break;
        case "C":
            input = [''];
            input_index = 0;
            $(".output_container div").text(input.join(""));
            break;
        case ".":
            input_value(button_value);
            $(".output_container div").text(input.join(""));
            break;
        case "*":
        case "/":
        case "+":
        case "-":
            input_operator(button_value);
            $(".output_container div").text(input.join(""));
            break;
        case "=":
            if(input[0] === ""){ //missing operands (i.e.====)in effect
                $(".output_container div").text("READY");
                return;
            }
            if(typeof input[0] === "number" && input.length === 1 && operator_type != "" && num2 != "") {//operation repeat in effect
                num1 = input[0];
                result = doMath(num1, num2, operator_type);
                input[0] = result;
                $(".output_container div").text(input.join(""));
            }
            compute();
            break;
        default:
            input_value(button_value);
            $(".output_container div").text(input.join(""));
            break;
    }
}

function compute() {
    for(var b = 0; b < input.length; b++){
        //Iterate through the array and display error for any value divided by 0
        if(input[b] === "/" && input[b+1] === "0"){
            $(".output_container div").text("ERROR");
            return;
        }
    }
    if(input.length == 3 && input[input.length-1] == ""){
        //partial operand function
        num1 = input[0];
        operator_type = input[input.length-2];
        num2 = num1;
        result = doMath(num1, num2, operator_type);
        input.splice(0, 2);
        input[0] = result;
    }
    for(var i = 0; i < input.length; i++){
        //order of operations #1: iterate through the array and find x and / operators first
        if (input[i] == "*" || input[i] == "/"){
            num1 = input[i-1];
            operator_type = input[i];
            num2 = input[i+1];
            result = doMath(num1, num2,operator_type);
            input[i+1] = result;
            input[i] = "";
            input[i-1] = "";
        }
    }
    for(var j = input.length-1; j >= 0 ; j--){
        //order of operations #2: delete all empty strings in array. This way, what's left in the array can be added or subtracted
        if (input[j] == ""){
            input.splice(j, 1);
        }
    }
    while(input.length > 2 && input[2] != "") {
        num1 = input[0];
        operator_type = input[1];
        num2 = input[2];
        result = doMath(num1, num2, operator_type);
        input.splice(0, 2);
        input[0] = result;
    }
    if(input[input.length-1] === "+" || input[input.length-1] === "-" || input[input.length-1] === "*" || input[input.length-1] === "/"){
        //for operation rollover
        num1 = input[0];
        operator_type = input[input.length-1];
        num2 = num1;
        result = doMath(num1, num2, operator_type);
        input.splice(0, 2);
        input[0] = result;
        operator_type = "";
        num2 = "";
    }
    $(".output_container div").text(input.join(""));
    input_index = 0;
}

function input_value(number){
    if(number === "." && input[input_index].indexOf(".") !== -1){
        //prevents the addition of multiple decimal points. The indexOf method returns -1 if the specified value cannot be found
        return;
    }
    input[input_index] += number;
}

function input_operator(operator){
    if(input[input_index] === ""){
        if(input_index === 0){
            return;
        }
        input[input_index-1] = operator;
        return;
    }
    input_index++;
    input[input_index] = operator;
    input_index++;
    input[input_index] = '';
}

function doMath(num1, num2, operator_type){
    switch (operator_type){
        case '+':
            return parseFloat(num1) + parseFloat(num2);
            break;
        case '-':
            return parseFloat(num1) - parseFloat(num2);
            break;
        case '/':
            return parseFloat(num1) / parseFloat(num2);
            break;
        case '*':
            return parseFloat(num1) * parseFloat(num2);
            break;
    }
}
