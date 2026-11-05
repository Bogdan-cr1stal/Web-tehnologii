
function sumOrMinus() {
    let numbers = Array.from(arguments);

    if (numbers.length % 2 === 0) {
        return numbers.reduce((sum, num) => sum + num, 0);
    } else {
        return numbers.reduceRight((result, num) => result - num);
    }
}

let output1 = "";

output1 += "sumOrMinus(1, 2, 3) = " + sumOrMinus(1, 2, 3) + "<br>";
output1 += "sumOrMinus(2, 5, 8, 4) = " + sumOrMinus(2, 5, 8, 4) + "<br>";
output1 += "sumOrMinus(8, 1, 2) = " + sumOrMinus(8, 1, 2);

document.getElementById("result1").innerHTML = output1;


function factorialRecursion(n) {
    if (n === 0 || n === 1) {
        return 1;
    }

    return n * factorialRecursion(n - 1);
}

let output2 = "";

output2 += "factorialRecursion(3) = " + factorialRecursion(3) + "<br>";
output2 += "factorialRecursion(5) = " + factorialRecursion(5) + "<br>";
output2 += "factorialRecursion(7) = " + factorialRecursion(7) + "<br>";
output2 += "factorialRecursion(0) = " + factorialRecursion(0);

document.getElementById("result2").innerHTML = output2;

let numberOfRecusrionCalls = 0;
let numberOfMemoCalls = 0;

function fibonachiRecursion(numberInRow) {
    numberOfRecusrionCalls++;

    if (numberInRow <= 1) {
        return 1;
    }

    return fibonachiRecursion(numberInRow - 1) +
           fibonachiRecursion(numberInRow - 2);
}

function createFibonachiMemo() {
    let cache = {};

    function fibonachi(numberInRow) {
        numberOfMemoCalls++;

        if (numberInRow <= 1) {
            return 1;
        }

        if (cache[numberInRow] !== undefined) {
            return cache[numberInRow];
        }

        cache[numberInRow] =
            fibonachi(numberInRow - 1) +
            fibonachi(numberInRow - 2);

        return cache[numberInRow];
    }

    return fibonachi;
}

const fibonachiMemo = createFibonachiMemo();

let resultRecursion = fibonachiRecursion(5);
let resultMemo = fibonachiMemo(5);

let output3 = "";

output3 += "Результат рекурсії: " + resultRecursion + "<br>";
output3 += "Кількість викликів рекурсії: " + numberOfRecusrionCalls + "<br><br>";

output3 += "Результат мемоїзації: " + resultMemo + "<br>";
output3 += "Кількість викликів мемоїзації: " + numberOfMemoCalls;

document.getElementById("result3").innerHTML = output3;

console.log(resultRecursion, numberOfRecusrionCalls);
console.log(resultMemo, numberOfMemoCalls);
