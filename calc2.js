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
		if (isEmptyLike(currentString) || isBinaryOperator(lastChar)) {
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


function ready(){
  var input = document.getElementById('input'),
    result = document.getElementById('result'), 
    clear = document.getElementById('clear'), 
    numbers = document.querySelectorAll('.numbers div'),
    operators = document.querySelectorAll('.operators div');

    function add(str) {
		input.innerHTML += str;
    }

    for (var i = 0; i < numbers.length; i++) {
    	numbers[i].addEventListener("click", function(e){
    		var number = e.target.innerHTML;
    		var currentString = input.innerHTML;
      		var lastChar = currentString[currentString.length - 1];
    		if (isPossible(number, currentString)) {
    			changeFontSize(input, currentString+number);
    			add(number);
    		} else if (number == "." && isEmptyLike(currentString)){
    			changeFontSize(input, currentString+"0.");
    			add("0.");
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
      			add(operator);
      		} else if (isBinaryOperator(operator) && isBinaryOperator(lastChar) && !hasLastUnMinus(currentString)
      			|| isUnaryPostOperator(operator) && ((isUnaryPostOperator(lastChar)) || lastChar == "²" || lastChar == "³")) {
      			currentString = currentString.substring(0, currentString.length - 1);
      			input.innerHTML = currentString;
      			changeFontSize(input, currentString+operator);
      			add(operator);
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
    	
    })
}
