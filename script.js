const buttons = document.querySelectorAll(".sort-option");
const sortTittle = document.querySelector(".container .tittle");
const generateButton = document.getElementById("generateBars");
const startButton = document.getElementById("startSort");
const barCountInput = document.getElementById("barCount");

const array= [];

let n = parseInt(barCountInput.value, 10) || 120;
let selectedSort = "Bubble";
let barElements = [];

generateBars();
generateButton.addEventListener("click", generateBars);
startButton.addEventListener("click", sort);

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedSort = button.dataset.sort;
    sortTittle.innerHTML = `${selectedSort} Sort`;
    console.log("Selected sort:", selectedSort);
  });
});

barCountInput.addEventListener("change", () => {
    generateBars();
});



function generateBars() {
    wrapper.innerHTML = "";
    barElements = [];

    n = parseInt(barCountInput.value, 10);
    if (isNaN(n) || n < 10) n = 10;
    if (n > 150) n = 150;
    barCountInput.value = n;

    array.length = 0;
    barElements.length = 0;

    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }

    
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = array[i] * 100 + "%";
        wrapper.appendChild(bar);
        barElements.push(bar);
    }
    startButton.disabled = false;
}

function sort() {
    startButton.disabled = true;
    generateButton.disabled = true;
    if (selectedSort == "Bubble") {
        bubbleSort();
    } else if (selectedSort == "Quick") {
        quickSort();
    } else {
        mergeSort();
    }
}

async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            barElements[j].style.background = "red";
            barElements[j + 1].style.background = "red";
            await sleep(5);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swapBars(j, j + 1);
            }
            await sleep(5);
            barElements[j].style.background = "black";
            barElements[j + 1].style.background = "black";
        }
    }
    for (let i = 0; i < array.length ; i++) {
        await sleep(1);
        barElements[i].style.background = "green";
    }
    generateButton.disabled = false;
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);

    for (let i = 0; i < array.length; i++) {
        barElements[i].style.background = "green";
        await sleep(5);
    }

    generateButton.disabled = false;
}


async function quickSortHelper(low, high) {
    if (low < high) {
        const pivotIndex = await partition(low, high);

        barElements[pivotIndex].style.background = "blue";

        await Promise.all([
            quickSortHelper(low, pivotIndex - 1),
            quickSortHelper(pivotIndex + 1, high)
        ]);

        barElements[pivotIndex].style.background = "black";
    }
}

async function partition(low, high) {
    let pivotValue = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        barElements[j].style.background = "red";
        barElements[high].style.background = "red"; 
        await sleep(20);
        if (array[j] < pivotValue) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            swapBars(i, j);
        }
        barElements[j].style.background = "black";
        barElements[high].style.background = "black";
    }
    
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swapBars(i + 1, high);
    barElements[i + 1].style.background = "black";
    await sleep(20);
    return i + 1;
}



async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);

    for (let i = 0; i < array.length; i++) {
        barElements[i].style.background = "green";
        await sleep(5);
    }

    generateButton.disabled = false;
}

async function mergeSortHelper(start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(start, mid);
    await mergeSortHelper(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    let leftIndex = start;
    let rightIndex = mid + 1;
    const temp = [];

    while (leftIndex <= mid && rightIndex <= end) {
        barElements[leftIndex].style.background = "red";
        barElements[rightIndex].style.background = "red";

        await sleep(20);

        if (array[leftIndex] <= array[rightIndex]) {
            temp.push(array[leftIndex]);

            barElements[leftIndex].style.background = "black";
            leftIndex++;
        } else {
            temp.push(array[rightIndex]);

            barElements[rightIndex].style.background = "black";
            rightIndex++;
        }
    }

    while (leftIndex <= mid) {
        temp.push(array[leftIndex]);
        barElements[leftIndex].style.background = "black";
        leftIndex++;
    }

    while (rightIndex <= end) {
        temp.push(array[rightIndex]);
        barElements[rightIndex].style.background = "black";
        rightIndex++;
    }

    for (let i = start; i <= end; i++) {
        array[i] = temp[i - start];
        barElements[i].style.height = array[i] * 100 + "%";
        barElements[i].style.background = "black";
        await sleep(10);
    }
}

function swapBars(i,j) {
    const tempHeight = barElements[i].style.height;
    barElements[i].style.height = barElements[j].style.height;
    barElements[j].style.height = tempHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

