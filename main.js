// Gate colors
const gateColors = {
    "AND": "#2980b9",
    "OR": "#e67e22",
    "XOR": "#f39c12",
    "NOT": "#2ecc71",
    "NAND": "#d35400",
    "NOR": "#8e44ad",
    "XNOR": "#c0392b"
};

const logicFunctions = {
    AND: (a, b) => a && b,
    OR: (a, b) => a || b,
    XOR: (a, b) => a !== b,
    NOT: (a) => !a,
    NAND: (a, b) => !(a && b),
    NOR: (a, b) => !(a || b),
    XNOR: (a, b) => a === b,
};

let blocks = [];
let connections = [];

// Create a block with specified type and position
function createBlock(type, x = 100, y = 100) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.background = gateColors[type];
    block.textContent = type;
    block.style.left = x + "px";
    block.style.top = y + "px";
    block.setAttribute("data-type", type);
    block.setAttribute("draggable", true);

    block.addEventListener("mousedown", (e) => startDrag(e, block));
    blocks.push({ element: block, type, inputs: [], output: null });
    document.getElementById("workspace").appendChild(block);
}

// Variables for drag and drop functionality
let offsetX, offsetY;

// Start dragging the block
function startDrag(e, block) {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = (event) => moveBlock(event, block);
    document.onmouseup = () => stopDrag();
}

// Move the block while dragging
function moveBlock(e, block) {
    block.style.left = e.pageX - offsetX + "px";
    block.style.top = e.pageY - offsetY + "px";
}

// Stop dragging the block
function stopDrag() {
    document.onmousemove = null;
    document.onmouseup = null;
}

// Connect blocks together
function connectBlocks(outputBlock, inputBlock) {
    connections.push({ from: outputBlock, to: inputBlock });
    inputBlock.inputs.push(outputBlock.output);
}

// Calculate and display the result
function calculateResult() {
    let resultDisplay = document.getElementById("result-display");
    let finalResults = [];

    blocks.forEach(block => {
        if (block.inputs.length > 0) {
            const inputValues = block.inputs.map(input => parseInt(input));
            block.output = logicFunctions[block.type](...inputValues);
            finalResults.push(`Output of ${block.type}: ${block.output ? "True" : "False"}`);
        }
    });

    resultDisplay.textContent = `Result: ${finalResults.join(', ')}`;
}

// Create blocks as an example
createBlock("AND", 50, 50);
createBlock("OR", 150, 50);
createBlock("XOR", 250, 50);
createBlock("NOT", 350, 50);
createBlock("NAND", 450, 50);
createBlock("NOR", 550, 50);
createBlock("XNOR", 650, 50);
