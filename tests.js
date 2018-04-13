describe ("changeNotation", function() {
	it("переводит в обратную польскую нотацию 2+2", function() {
		assert.equal(String(changeNotation("2+2")), "2,2,+");
	});
	it("переводит в обратную польскую нотацию (2+2)/2", function() {
		assert.equal(String(changeNotation("(2+2)÷2")), "2,2,+,2,÷");
	});
	it("переводит в обратную польскую нотацию 5²-(-3+100%)+(4-2)×8!", function() {
		assert.equal(String(changeNotation("5²-(~3+100%)+(4-2)×8!")), "5,²,3,~,100,%,+,-,4,2,-,8,!,×,+");
	});
	it("переводит в обратную польскую нотацию 8+4-56.8", function() {
		assert.equal(String(changeNotation("8+4-56.8")), "8,4,+,56.8,-");
	});
	it("переводит в обратную польскую нотацию -3×(√9×2³+20×50%÷2×(1+1))", function() {
		assert.equal(String(changeNotation("~3×(√9×2³+20×50%÷2×(1+1))")), "3,~,9,√,2,³,×,20,50,%,×,2,÷,1,1,+,×,+,×");
	});
	it("переводит в обратную польскую нотацию √9×2³+20", function() {
		assert.equal(String(changeNotation("√9×2³+20")), "9,√,2,³,×,20,+");
	});
});

describe("calculate", function() {
	it("вычисляет 2,2,+", function() {
		assert.equal(String(calculate([2,2,"+"])), "4");
	});
	it("вычисляет 2,2,+,2,÷", function() {
		assert.equal(String(calculate([2,2,"+",2,"÷"])), "2");
	});
	it("вычисляет 5,²,3,~,100,%,+,-,4,2,-,8,!,×,+", function() {
		assert.equal(String(calculate([5,"²",3,"~",100,"%","+","-",4,2,"-",8,"!","×","+"])), "80667");
	});
	it("вычисляет 8,4,+,56.8,-", function() {
		assert.equal(String(calculate([8,4,"+",56.8,"-"])), "-44.8");
	});
	it("вычисляет 3,~,9,√,2,³,×,20,50,%,×,2,÷,1,1,+,×,+,×", function() {
		assert.equal(String(calculate([3,"~",9,"√",2,"³","×",20,50,"%","×",2,"÷",1,1,"+","×","+","×"])), "-102");
	});
	it("вычисляет 9,√,2,³,×,20,+", function() {
		assert.equal(String(calculate([9,"√",2,"³","×",20,"+"])), "44");
	});
});

describe ("changeNotation and calculate", function() {
	it("вычисляет 2+2", function() {
		var changedNotation = changeNotation("2+2");
		assert.equal(calculate(changedNotation), 4);
	});
	it("вычисляет (2+2)/2", function() {
		var changedNotation = changeNotation("(2+2)÷2");
		assert.equal(calculate(changedNotation), 2);
	});
	it("вычисляет 5²-(-3+100%)+(4-2)×8!", function() {
		var changedNotation = changeNotation("5²-(~3+100%)+(4-2)×8!");
		assert.equal(calculate(changedNotation), 80667);
	});
	it("вычисляет 8+4-56.8", function() {
		var changedNotation = changeNotation("8+4-56.8");
		assert.equal(calculate(changedNotation), -44.8);
	});
	it("вычисляет -3×(√9×2³+20×50%÷2×(1+1))", function() {
		var changedNotation = changeNotation("~3×(√9×2³+20×50%÷2×(1+1))");
		assert.equal(calculate(changedNotation), -102);
	});
	it("вычисляет √9×2³+20", function() {
		var changedNotation = changeNotation("√9×2³+20");
		assert.equal(calculate(changedNotation), 44);
	});
});

describe ("change input string", function() {
	it("преобразует в нормальный вид 2+(2", function() {
		assert.equal(String(clearString("2+(2")), "2+2");
	});
	it("преобразует в нормальный вид 2+(2×", function() {
		assert.equal(String(clearString("2+(2")), "2+2");
	});
	it("преобразует в нормальный вид 2+(2×(", function() {
		assert.equal(String(clearString("2+(2×(")), "2+2");
	});
	it("преобразует в нормальный вид 2+(2×(((3", function() {
		assert.equal(String(clearString("2+(2×(((3")), "2+2×3");
	});
})