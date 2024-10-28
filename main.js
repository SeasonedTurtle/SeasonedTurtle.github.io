const canvas = document.getElementById("canvas");
const svg = document.getElementById("connection-lines");

let blocks = [];
let outputBlock = null;

class Block {
    constructor(x, y, type, func) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.func = func;
        this.inputs = [];
        this.output = null;
        this.connectedTo = null;

        this.element = document.createElement("div");
        this.element.className = "block " + (type === "Input" ? "input-block" : type === "Output" ? "output-block" : "logic-block");
        this.element.innerText = type;
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        canvas.parentNode.appendChild(this.element);

        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
    }

    onMouseDown(e) {
        e.preventDefault();
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.offsetX = e.clientX - this.x;
        this.offsetY = e.clientY - this.y;
    }

    onMouseMove(e) {
        this.x = e.clientX - this.offsetX;
        this.y = e.clientY - this.offsetY;
        this.updatePosition();
        this.updateConnections();
    }

    onMouseUp() {
        document.removeEventListener("mousemove", this.onMouseMove.bind(this));
        document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    updateConnections() {
        if (this.connectedTo) {
            this.connectedTo.updateLine(this);
        }
    }

    connectTo(target) {
        this.connectedTo = new ConnectionLine(this, target);
    }

    calculate() {
        if (this.type === "Input") return this.output;
        if (this.func) {
            const inputValues = this.inputs.map(input => input.output);
            this.output = this.func(...inputValues);
        }
    }
}

class ConnectionLine {
    constructor(startBlock, endBlock) {
        this.startBlock = startBlock;
        this.endBlock = endBlock;
        this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        this.line.setAttribute("stroke", "black");
        this.line.setAttribute("stroke-width", 2);
        svg.appendChild(this.line);
        this.updateLine();
    }

    updateLine() {
        this.line.setAttribute("x1", this.startBlock.x + 50);
        this.line.setAttribute("y1", this.startBlock.y + 30);
        this.line.setAttribute("x2", this.endBlock.x + 50);
        this.line.setAttribute("y2", this.endBlock.y + 30);
    }
}

function addGate(type) {
    const func = type === "AND" ? (a, b) => a && b : type === "OR" ? (a, b) => a || b : (a) => !a;
    blocks.push(new Block(100, 100, type, func));
}

function addInput() {
    const inputBlock = new Block(100, 200, "Input", null);
    blocks.push(inputBlock);
}

function addOutput() {
    if (outputBlock) {
        alert("Only one output block allowed");
        return;
    }
    outputBlock = new Block(300, 200, "Output", null);
    blocks.push(outputBlock);
}

function calculateResult() {
    blocks.forEach(block => block.calculate());
    document.getElementById("result").textContent = "Result: " + (outputBlock.output ? "True" : "False");
}

function resetCanvas() {
    blocks.forEach(block => block.element.remove());
    blocks = [];
    outputBlock = null;
    svg.innerHTML = '';
    document.getElementById("result").textContent = "Result: ";
}
