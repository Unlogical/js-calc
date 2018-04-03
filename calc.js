"use strict";

document.addEventListener("DOMContentLoaded", ready);

function ready(){
  var input = document.getElementById('input'),
    number = document.querySelectorAll('.numbers div'),
    operator = document.querySelectorAll('.operators div'), 
    result = document.getElementById('result'), 
    clear = document.getElementById('clear'), 
    resultDisplayed = false; 


  function isBinaryOperator(character) {
    if (character == "+" || character == "-" || character == "×" || character == "÷") {
      return true;
    }
    return false;
  }
  function isUnaryOperator(character) {
    if (character == "²" || character == "√") {
      return true;
    }
    return false;
  }


  for (var i = 0; i < number.length; i++) {
    number[i].addEventListener("click", function(e) {
      var currentString = input.innerHTML;
      var lastChar = currentString[currentString.length - 1];
      if (e.target.innerHTML == ".") {
        if (currentString.length == 0 || lastChar == "√"){
          console.log("enter a number first");
        } else {
          input.innerHTML += e.target.innerHTML;
        }
      }else if (!resultDisplayed) {
        input.innerHTML += e.target.innerHTML;
      } else if (resultDisplayed  && isBinaryOperator(lastChar)) {
        resultDisplayed = false;
        input.innerHTML += e.target.innerHTML;
      } else {
        resultDisplayed = false;
        input.innerHTML = "";
        input.innerHTML += e.target.innerHTML;
      }
    });
  }


  for (var i = 0; i < operator.length; i++) {
    operator[i].addEventListener("click", function(e) {
      var currentString = input.innerHTML;
      var lastChar = currentString[currentString.length - 1];
      if (isBinaryOperator(e.target.innerHTML)) {
        if (isBinaryOperator(lastChar) || lastChar == "√") {
          var newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
          input.innerHTML = newString;
        } else if (currentString.length == 0) {
          console.log("enter a number first");
        } else {
          input.innerHTML += e.target.innerHTML;
        }      
      } else if (e.target.innerHTML == "x²") {
          if (currentString.length == 0 || isUnaryOperator(lastChar) || isBinaryOperator(lastChar)) {
            console.log("enter a number first");
        } else if (isBinaryOperator(lastChar) || lastChar == "√") {
           var newString = currentString.substring(0, currentString.length - 1) + "²";
          input.innerHTML = newString; 
        } else {
          input.innerHTML += "²"
        }
      } else if (e.target.innerHTML == "√") {
        if (currentString.length == 0 || isBinaryOperator(lastChar)) {
          input.innerHTML += e.target.innerHTML;
        } else {
          console.log("it must be before number");  
        }
      }

    });
  }

  function binaryOperation(a,b, operation){
    a = parseFloat(a);
    if (!b) {
      return a;
    } else {
      b = parseFloat(b);
      if (operation == "÷") {
        return a/b;
      }
      if (operation == "×") {
        return a*b;
      }
      if (operation == "+") {
        return a+b;
      }
      if (operation == "-") {
        return a-b;
      }
    }
  }

  function unaryOperation(a, operation) {
    a = parseFloat(a);
    if (operation == "²") {
        return Math.pow(a, 2);
      }
    if (operation == "√") {
        return Math.sqrt(a);
    }
  }

  result.addEventListener("click", function() {
    function performOperation(operation) {
      var operatorIndex = operators.indexOf(operation);
      while (operatorIndex != -1) {
        if (isBinaryOperator(operation)){
          var calculated = binaryOperation(numbers[operatorIndex],numbers[operatorIndex + 1], operation);
          numbers.splice(operatorIndex, 2, calculated);
        } else {
          var calculated = unaryOperation(numbers[operatorIndex], operation);
          numbers.splice(operatorIndex, 1, calculated);
        }
        operators.splice(operatorIndex, 1);   
        operatorIndex = operators.indexOf(operation);
      } 
    }

    var inputString = input.innerHTML;
    var numbers = inputString.split(/\+|\-|\×|\÷|\√|\²/g);
    var operators = inputString.replace(/[0-9]|\./g, "").split("");
    for (i = 0; i < numbers.length; i++){
      while (numbers[i] == "") {
        numbers.splice(i, 1);
      }
    }
    for (i = 0; i < operators.length; i++) {
      if (isUnaryOperator(operators[i])) {
        performOperation(operators[i]);
      }
    }
    performOperation("÷");
    performOperation("×");
    while (operators.length > 0) {
      performOperation(operators[0]);
    }
    input.innerHTML = numbers[0]; 
    resultDisplayed = true; 
  });

  clear.addEventListener("click", function() {
    input.innerHTML = "";
  })

}
