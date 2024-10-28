// script.js

let workspace = document.getElementById("workspace");
let outputDisplay = document.getElementById("output");
let gateCount = 0;
let inputCount = 0;
let gates = [];

// Define logic operations for each gate
const gateLogic = {
  AND: (a, b) => a && b,
  OR: (a, b) => a || b,
  XOR: (a, b) => a ^ b,
  NOT: (a) => !a,
  NAND: (a, b) => !(a && b),
  NOR: (a, b) => !(a || b),
  XNOR: (a, b) => !(a ^ b),
};

// Create Gate Block
function createGate(type) {
  let gate = document.createElement("div");
  gate.classList.add("block");
  gate.textContent = type;
  gate.dataset.type = type;
  gate.dataset.id = `gate${gateCount++}`;
  gate.dataset.inputs = JSON.stringify([]);
  gate.style.top = `${Math.random() * 400}px`;
  gate.style.left = `${Math.random() * 400}px`;

  gate.addEventListener("click", () => toggleInput(gate));
  workspace.appendChild(gate);
  gates.push(gate);
}

// Create Input Block
function createInputBlock() {
  let inputBlock = document.createElement("div");
  inputBlock.classList.add("block");
  inputBlock.textContent = `Input ${inputCount}`;
  inputBlock.dataset.type = "INPUT";
  inputBlock.dataset.value = 0;
  inputBlock.dataset.id = `input${inputCount++}`;
  inputBlock.style.top = `${Math.random() * 400}px`;
  inputBlock.style.left = `${Math.random() * 400}px`;

  inputBlock.addEventListener("click", () => toggleValue(inputBlock));
  workspace.appendChild(inputBlock);
  gates.push(inputBlock);
}

// Toggle input block value
function toggleValue(inputBlock) {
  inputBlock.dataset.value = inputBlock.dataset.value === "0" ? "1" : "0";
  inputBlock.style.backgroundColor = inputBlock.dataset.value === "1" ? "#4CAF50" : "#f44336";
}

// Connect blocks by setting inputs
function toggleInput(gate) {
  let availableInputs = gates.filter((g) => g.dataset.type === "INPUT" || g.dataset.type === "GATE");
  let selectedInputs = JSON.parse(gate.dataset.inputs);

  if (selectedInputs.length < (gate.dataset.type === "NOT" ? 1 : 2)) {
    let input = availableInputs.find((i) => !selectedInputs.includes(i.dataset.id));
    if (input) selectedInputs.push(input.dataset.id);
  }

  gate.dataset.inputs = JSON.stringify(selectedInputs);
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
