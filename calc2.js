"use strict";

document.addEventListener("DOMContentLoaded", ready);

var paranthesesFlag = 0;

function isBinaryOperator(character) {
    return (character == "+" || character == "×" || character == "÷" || character == "-");
}

function isUnaryPreOperator(character) {
	return (character == "~" || character == "√" );
}

function isUnaryPostOperator(character) {
	return (character == "²" || character == "³" || character == "!" || character == "%");
}

function isDigit(character) {
	return (parseInt(character) < 10 && parseInt(character) >= 0);
}

function isUnaryOperator(character) {
	return (isUnaryPostOperator(character) || isUnaryPreOperator(character));
}

function isOperator(character) {
	return (isBinaryOperator(character) || isUnaryOperator(character));
}

function hasPoint(currentString) {
  var numbers = currentString.split(/\+|\-|\×|\÷|\√|\²/g);
  var number = numbers[numbers.length - 1];
  return (number.indexOf(".") != -1);
}

function changeFontSize(input, currentString){
  if (currentString.length >= 15) {
      input.style.fontSize = "0.9rem";
    } else if (currentString.length >= 10) {
      input.style.fontSize = "1.5rem";
    } else {
      input.style.fontSize = "2.5rem";
    }
}

function isEmptyLike(currentString) {
	var lastChar = currentString[currentString.length - 1];
	return (currentString == "" || lastChar == "(");
}

function hasLastUnMinus(currentString){
	var lastChar = currentString[currentString.length - 1];
	var preLastChar =  currentString[currentString.length - 2]; 
	return (lastChar == "-" && (preLastChar === undefined || preLastChar == "("))
}

function changeMinuses(inputString) {
	var resultString = inputString;
	if (inputString[0] == "-") {
		resultString[0] = "~";
	}
	for (var i = 0; i < inputString.length - 1; i++) {
		if (inputString[i] == "(" && inputString[i + 1] == "-") {
			resultString[i + 1] == "~";
		}
	}
	return resultString;
}



function isPossible(character, currentString) {
	var lastChar = currentString[currentString.length - 1];
	if (isDigit(character)) {
		return !(lastChar == ")" || isUnaryPostOperator(lastChar));
	}
	if(character == ".") {
		return (isDigit(lastChar) && !hasPoint(currentString));
	}
	if (character == "-") {
		return (isEmptyLike(currentString) || isDigit(lastChar) || isUnaryPostOperator(lastChar) || lastChar == ")");
	}
	if(isBinaryOperator(character)) {
		return(isDigit(lastChar) || isUnaryPostOperator(lastChar) || lastChar == ")");
	}
	if(isUnaryPreOperator(character)) {
		return (isEmptyLike(currentString) || isBinaryOperator(lastChar))
	}
	if(isUnaryPostOperator(character)) {
		return (isDigit(lastChar) || lastChar == ")");
	}
	if(character == "(") {
		if (isEmptyLike(currentString) || isBinaryOperator(lastChar) || isUnaryPreOperator(lastChar) || hasLastUnMinus(currentString)) {
			paranthesesFlag++;
			return true;
		}
		return false;
	}
	if(character == ")") {
		if (paranthesesFlag > 0 && (isDigit(lastChar) || isUnaryPostOperator(lastChar) || lastChar == ")")) {
			paranthesesFlag--;
			return true;
		}
		return false;
	}
}

function priority(operator) {
	switch (operator){
		case "(": return 1;
		case ")": return 1;
		case "+": return 2;
		case "-": return 2;
		case "×": return 4;
		case "÷": return 4;
		case "√": return 6;
		case "~": return 6;
		case "²": return 8;
		case "³": return 8;
		case "%": return 8;
		case "!": return 8;
	}
}
function changeNotation(currentString) {
	var stack = [];
	var output = [];
	var number = "";
	for (var i = 0; i < currentString.length; i++) {
		if (isDigit(currentString[i]) || currentString[i] == ".") {
			number += currentString[i];
		} else if (currentString[i] == "(") {
			stack.push(currentString[i]);
		} else if (currentString[i] == ")") {
			var op = stack.pop();
			while (op != "(") {
				output.push(op);
				op = stack.pop();
			}
		} else if(isOperator(currentString[i])) {
			if (number != "") {
				output.push(parseFloat(number));
				number = "";
			}
			if (stack.length == 0) {
				stack.push(currentString[i]);
			} else if (priority(currentString[i]) > priority(stack[stack.length-1])) {
				stack.push(currentString[i]);
			} else {
				var op = stack.pop();
				output.push(op);
				stack.push(currentString[i]);
			}
		}
 	}
 	if (number != "") {
 		output.push(number);
 	}
 	while (stack.length > 0) {
 		var op = stack.pop();
 		output.push(op);
 	}
 	return output;
}

function factorial(number) {
	if (number <= 1) {
		return number;
	} else {
		return number * factorial(number - 1);;
	}
}

function performUnaryOperation(number, operator){
	number = parseFloat(number);
	switch (operator) {
		case "~": return -number;
		case "√": return Math.sqrt(number);
		case "²": return Math.pow(number, 2);
		case "³": return Math.pow(number, 3);
		case "!": return factorial(number);
		case "%": return number/100;
	}
}

function performBinaryOperation (a, b, operator) {
	a = parseFloat(a);
	b = parseFloat(b);
	switch (operator) {
		case "+": return a + b;
		case "-": return a - b;
		case "×": return a * b;
		case "÷": return a / b;
	}
}
function calculate(list) {
	for (var i = 0; i < list.length; i++) {
		if (isUnaryOperator(list[i])) {
			list[i] = performUnaryOperation(list[i-1], list[i]);
		}
		if (isBinaryOperator(list[i])) {
			list[i] = performBinaryOperation(list[i-2], list[i-1], list[i]);
		}
	}
	return list[list.length-1];
}



function ready(){
  var input = document.getElementById('input'),
    result = document.getElementById('result'), 
    clear = document.getElementById('clear'), 
    numbers = document.querySelectorAll('.numbers div'),
    operators = document.querySelectorAll('.operators div');

    for (var i = 0; i < numbers.length; i++) {
    	numbers[i].addEventListener("click", function(e){
    		var number = e.target.innerHTML;
    		var currentString = input.innerHTML;
      		var lastChar = currentString[currentString.length - 1];
    		if (isPossible(number, currentString)) {
    			changeFontSize(input, currentString+number);
    			input.innerHTML += number;
    		} else if (number == "." && isEmptyLike(currentString)){
    			changeFontSize(input, currentString+"0.");
    			input.innerHTML +="0.";
    		}
    	})
    }

    for (var i =0; i < operators.length; i++){
    	operators[i].addEventListener("click", function(e){
    		var operator = e.target.innerHTML;
    		operator = operator.replace("x", "");
    		var currentString = input.innerHTML;
      		var lastChar = currentString[currentString.length - 1];
      		if(isPossible(operator, currentString)) {
      			changeFontSize(input, currentString+operator);
      			input.innerHTML +=operator;
      		} else if (isBinaryOperator(operator) && isBinaryOperator(lastChar) && !hasLastUnMinus(currentString)
      			|| isUnaryPostOperator(operator) && (isUnaryPostOperator(lastChar) || hasLastUnMinus(currentString))) {
      			currentString = currentString.substring(0, currentString.length - 1);
      			input.innerHTML = currentString;
      			changeFontSize(input, currentString+operator);
      			input.innerHTML +=operator;
      		}
    	})
    }

    clear.addEventListener("click", function(e) {
    	input.innerHTML = "";
    	paranthesesFlag = 0;
    })

    result.addEventListener("click", function(e) {
    	var inputString = input.innerHTML;
    	inputString = changeMinuses(inputString);
    	paranthesesFlag = 0;
    	// var numbers = inputString.split(/\+|\-|\×|\÷|\√|\²|\³|\!|\%|\(|\)|/g);
      	var operators = inputString.replace(/[0-9]|\./g, "").split("");
      	// priorities = changePriorities(operators);
      	var output = changeNotation(inputString);
      	input.innerHTML = calculate(output);
      	
    })
}



// function changePriorities(operators) {
// 	var value = 0;
// 	priorities = [];
// 	for (var i = 0; i < operators.length; i++) {
// 		switch (operators[i]){
// 			case "(": priorities[i] = 1;
// 			case ")": priorities[i] = 1;
// 			case "+": priorities[i] = 2;
// 			case "-": priorities[i] = 2;
// 			case "×": priorities[i] = 4;
// 			case "÷": priorities[i] = 4;
// 			case "√": priorities[i] = 6;
// 			case "~": priorities[i] = 6;
// 			case "²": priorities[i] = 8;
// 			case "³": priorities[i] = 8;
// 			case "%": priorities[i] = 8;
// 			case "!": priorities[i] = 8;
// 		}
// 	}
// 	return priorities;
// }

// function removeParantheses(currentString) {
// 	return currentString.replace(/\(|\)/g, "");
// }

// function removeEmptyElements(list) {
//     for (var i = 0; i < list.length; i++){
//     	while (list[i] == "") {
//       	list.splice(i, 1);
//     	}
//   	}
//   	return list;
// }


// function setPriorities() {
// 	priorities = {};
// 	priorities["+"] = 2;
// 	priorities["-"] = 2;
// 	priorities["×"] = 4;
// 	priorities["÷"] = 4;
// 	priorities["√"] = 6;
// 	priorities["~"] = 6;
// 	priorities["²"] = 8;
// 	priorities["³"] = 8;
// 	priorities["%"] = 8;
// 	priorities["!"] = 8;
// 	return priorities;
// }