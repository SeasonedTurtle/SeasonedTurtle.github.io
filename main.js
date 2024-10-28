// main.js

let workspace = document.getElementById("workspace");
let outputDisplay = document.getElementById("output");
let gateCount = 0;
let inputCount = 0;
let gates = [];
let connections = [];

// Gate logic
const gateLogic = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  XOR: (a, b) => a ^ b,
  NOT: (a) => !a,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XNOR: (a, b) => !(a ^ b),
};

// URLs for PNG images for each gate
const gateImages = {
  AND: "https://cdn-icons-png.flaticon.com/512/1400/1400480.png", // Update with correct PNG link
  OR: "https://cdn-icons-png.flaticon.com/512/1400/1400483.png", // Update with correct PNG link
  XOR: "https://cdn-icons-png.flaticon.com/512/1400/1400484.png", // Update with correct PNG link
  NOT: "https://cdn-icons-png.flaticon.com/512/1400/1400481.png", // Update with correct PNG link
  NAND: "https://cdn-icons-png.flaticon.com/512/1400/1400482.png", // Update with correct PNG link
  NOR: "https://cdn-icons-png.flaticon.com/512/1400/1400485.png", // Update with correct PNG link
  XNOR: "https://cdn-icons-png.flaticon.com/512/1400/1400486.png", // Update with correct PNG link
  INPUT_1: "https://cdn-icons-png.flaticon.com/512/1400/1400490.png", // Input 1 icon link
  INPUT_0: "https://cdn-icons-png.flaticon.com/512/1400/1400491.png"  // Input 0 icon link
};

// Create Gate Block
function createGate(type) {
  let gate = createBlock(type, `gate${gateCount++}`);
  gate.dataset.inputs = JSON.stringify([]);
  gate.dataset.type = type;
  
  // Set background image for the gate
  gate.style.backgroundImage = `url(${gateImages[type]})`;
  gate.style.backgroundSize = "contain";
  gate.style.backgroundRepeat = "no-repeat";
  gate.style.backgroundPosition = "center";
  
  gates.push(gate);
}

// Create Input Block
function createInputBlock(value) {
  let inputBlock = createBlock(`Input ${inputCount}`, `input${inputCount++}`);
  inputBlock.dataset.value = value;
  inputBlock.dataset.type = "INPUT";
  inputBlock.onclick = () => toggleValue(inputBlock);

  // Set background image for input blocks
  inputBlock.style.backgroundImage = `url(${value === "1" ? gateImages.INPUT_1 : gateImages.INPUT_0})`;
  inputBlock.style.backgroundSize = "contain";
  inputBlock.style.backgroundRepeat = "no-repeat";
  inputBlock.style.backgroundPosition = "center";

  inputBlock.style.backgroundColor = value === "1" ? "#4CAF50" : "#f44336";
}

// Create a Block (base function)
function createBlock(name, id) {
  let block = document.createElement("div");
  block.classList.add("block");
  block.dataset.id = id;

  block.draggable = true;
  block.ondragstart = dragStart;
  block.ondragend = dragEnd;

  workspace.appendChild(block);
  return block;
}

// Drag-and-drop functions
function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
}

function dragEnd(event) {
  let target = event.target;
  target.style.position = "absolute";
  target.style.left = `${event.clientX - target.offsetWidth / 2}px`;
  target.style.top = `${event.clientY - target.offsetHeight / 2}px`;
}

// Toggle input block value
function toggleValue(inputBlock) {
  inputBlock.dataset.value = inputBlock.dataset.value === "0" ? "1" : "0";
  inputBlock.style.backgroundColor = inputBlock.dataset.value === "1" ? "#4CAF50" : "#f44336";
  inputBlock.style.backgroundImage = `url(${inputBlock.dataset.value === "1" ? gateImages.INPUT_1 : gateImages.INPUT_0})`;
}

// Calculate the result by applying gate logic
function calculateResult() {
  outputDisplay.innerHTML = "<h3>Results:</h3>";
  gates.forEach((gate) => {
    if (gate.dataset.type !== "INPUT") {
      let inputs = JSON.parse(gate.dataset.inputs).map(
        (inputId) => gates.find((g) => g.dataset.id === inputId).dataset.value
      );
      let result = gateLogic[gate.dataset.type](...inputs.map(Number));
      outputDisplay.innerHTML += `<p>${gate.dataset.type} ${gate.dataset.id}: ${result ? "1" : "0"}</p>`;
      gate.dataset.value = result ? "1" : "0";
    }
  });
}

// Connect two blocks
function connectBlocks(fromId, toId) {
  let fromBlock = gates.find(g => g.dataset.id === fromId);
  let toBlock = gates.find(g => g.dataset.id === toId);
  
  if (fromBlock && toBlock && toBlock.dataset.type !== "INPUT") {
    let inputs = JSON.parse(toBlock.dataset.inputs);
    if (inputs.length < (toBlock.dataset.type === "NOT" ? 1 : 2)) {
      inputs.push(fromBlock.dataset.id);
      toBlock.dataset.inputs = JSON.stringify(inputs);
      connections.push({ from: fromBlock, to: toBlock });
      renderConnections();
    }
  }
}

// Render connections with SVG
function renderConnections() {
  let svg = document.querySelector("svg");
  if (svg) svg.remove();

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", workspace.offsetWidth);
  svg.setAttribute("height", workspace.offsetHeight);
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";

  connections.forEach(({ from, to }) => {
    let fromPos = from.getBoundingClientRect();
    let toPos = to.getBoundingClientRect();
    
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", fromPos.left + fromPos.width / 2);
    line.setAttribute("y1", fromPos.top + fromPos.height / 2);
    line.setAttribute("x2", toPos.left + toPos.width / 2);
    line.setAttribute("y2", toPos.top + toPos.height / 2);
    line.setAttribute("stroke", "#000");
    line.setAttribute("stroke-width", "2");

    svg.appendChild(line);
  });

  workspace.appendChild(svg);
}
