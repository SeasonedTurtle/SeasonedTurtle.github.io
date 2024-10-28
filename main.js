const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let blocks = [];
let lines = [];
let outputBlock = null;

class Block {
    constructor(x, y, type, func) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.func = func;
        this.inputs = [];
        this.output = null;
    }

    draw() {
        ctx.fillStyle = "lightblue";
        ctx.fillRect(this.x, this.y, 80, 50);
        ctx.fillStyle = "black";
        ctx.fillText(this.type, this.x + 10, this.y + 30);
    }
}

class InputBlock extends Block {
    constructor(x, y) {
        super(x, y, "Input", null);
        this.value = null;
    }

    draw() {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(this.x, this.y, 80, 50);
        ctx.fillStyle = "black";
        ctx.fillText("Input", this.x + 10, this.y + 30);
    }
}

class OutputBlock extends Block {
    constructor(x, y) {
        super(x, y, "Output", null);
    }

    draw() {
        ctx.fillStyle = "lightcoral";
        ctx.fillRect(this.x, this.y, 80, 50);
        ctx.fillStyle = "black";
        ctx.fillText("Output", this.x + 10, this.y + 30);
    }

    calculate() {
        if (this.inputs[0]) {
            this.output = this.inputs[0].output;
        }
    }
}

function addGate(type) {
    let func;
    switch(type) {
        case 'AND': func = (a, b) => a && b; break;
        case 'OR': func = (a, b) => a || b; break;
        case 'NOT': func = (a) => !a; break;
        default: return;
    }
    const block = new Block(100, 100, type, func);
    blocks.push(block);
    drawCanvas();
}

function addInput() {
    const inputBlock = new InputBlock(100, 200);
    blocks.push(inputBlock);
    drawCanvas();
}

function addOutput() {
    if (outputBlock) {
        alert("Only one output block allowed");
        return;
    }
    outputBlock = new OutputBlock(300, 200);
    blocks.push(outputBlock);
    drawCanvas();
}

function calculateResult() {
    outputBlock.calculate();
    document.getElementById("result").textContent = "Result: " + (outputBlock.output ? "True" : "False");
}

function resetCanvas() {
    blocks = [];
    lines = [];
    outputBlock = null;
    document.getElementById("result").textContent = "Result: ";
    drawCanvas();
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach(block => block.draw());
}

canvas.addEventListener("click", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    // Add logic to select, move, or connect blocks
});
