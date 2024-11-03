const gates = document.querySelectorAll('.gate');
const inputs = document.querySelectorAll('.input');
const outputs = document.querySelectorAll('.output');
const workspace = document.getElementById('workspace');
let startConnector = null;
let drawingLine = null;
let connections = [];

// Draggable gates, inputs, and outputs
[...gates, ...inputs, ...outputs].forEach(item => {
    item.addEventListener('dragstart', (e) => {
        const type = e.target.dataset.type || e.target.dataset.value || e.target.innerText;
        e.dataTransfer.setData('text/plain', JSON.stringify({ type }));
        console.log(`Dragging: ${type}`);
    });
});

// Allow dropping in the workspace
workspace.addEventListener('dragover', (e) => {
    e.preventDefault();
});

workspace.addEventListener('drop', (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const newElement = document.createElement('div');
    const rect = workspace.getBoundingClientRect();
    newElement.style.position = 'absolute';
    newElement.style.left = `${e.clientX - rect.left - 25}px`;
    newElement.style.top = `${e.clientY - rect.top - 25}px`;
    newElement.className = data.type === 'OUTPUT' ? 'output' : 'gate';
    
    if (data.type === 'OUTPUT') {
        newElement.innerText = 'Output';
        newElement.innerHTML += '<div class="connector left"><div class="connector-extension"></div></div>';
    } else {
        newElement.innerText = data.type;

        if (data.type === 'NOT') {
            newElement.innerHTML += '<div class="connector left"><div class="connector-extension"></div></div><div class="connector right"><div class="connector-extension"></div></div>';
        } else if (['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'].includes(data.type)) {
            newElement.innerHTML += '<div class="connector left"><div class="connector-extension"></div></div><div class="connector left"><div class="connector-extension"></div></div><div class="connector right"><div class="connector-extension"></div></div>';
        } else if (['0', '1'].includes(data.type)) {
            newElement.innerHTML += '<div class="connector right"><div class="connector-extension"></div></div>';
        }
    }

    newElement.dataset.type = data.type;
    newElement.draggable = true;

    newElement.addEventListener('dragend', (e) => {
        const rect = workspace.getBoundingClientRect();
        newElement.style.left = `${e.clientX - rect.left - 25}px`;
        newElement.style.top = `${e.clientY - rect.top - 25}px`;
    });

    workspace.appendChild(newElement);
});

// Reset button functionality
document.getElementById('reset-button').addEventListener('click', () => {
    while (workspace.firstChild) {
        workspace.removeChild(workspace.firstChild);
    }
    connections = [];
});

// Connectors interaction
workspace.addEventListener('mousedown', (e) => {
    if (e.button === 2 && e.target.classList.contains('connector')) {
        startConnector = e.target;
        drawingLine = document.createElement('div');
        drawingLine.className = 'line';
        workspace.appendChild(drawingLine);
        updateLine(e);
    }
});

workspace.addEventListener('mousemove', (e) => {
    if (drawingLine) {
        updateLine(e);
    }
});

workspace.addEventListener('mouseup', (e) => {
    if (drawingLine && e.button === 2) {
        if (e.target.classList.contains('connector') && e.target !== startConnector) {
            const endConnector = e.target;

            // Check if start and end connectors belong to the same block
            if (startConnector.parentElement === endConnector.parentElement) {
                console.log("Cannot connect connectors of the same block.");
                cleanupConnection();
                return; // Exit if the connectors are from the same block
            }

            // Prevent output to output connections
            if (startConnector.classList.contains('output') && endConnector.classList.contains('output')) {
                console.log("Cannot connect output connectors.");
                cleanupConnection();
                return; // Exit if both connectors are outputs
            }

            // Prevent connecting right connectors to each other
            if (startConnector.classList.contains('right') && endConnector.classList.contains('right')) {
                console.log("Cannot connect right connectors.");
                cleanupConnection();
                return; // Exit if both connectors are right connectors
            }

            // Check if either connector already has a connection
            const isStartConnected = connections.some(conn => conn.start === startConnector || conn.end === startConnector);
            const isEndConnected = connections.some(conn => conn.start === endConnector || conn.end === endConnector);

            if (isStartConnected || isEndConnected) {
                console.log("One of the connectors is already connected.");
                cleanupConnection();
                return; // Exit if either connector is already connected
            }

            // If all checks pass, create the connection
            const line = document.createElement('div');
            line.className = 'line';
            workspace.appendChild(line);
            connectLine(startConnector, endConnector, line);
            connections.push({ start: startConnector, end: endConnector, line });
            lockElements(startConnector, endConnector);
        }
        cleanupConnection();
    }
});

// Helper function to clean up the connection attempt
function cleanupConnection() {
    if (drawingLine) {
        workspace.removeChild(drawingLine);
    }
    drawingLine = null;
    startConnector = null;
}


// Disable right-click context menu
workspace.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

workspace.addEventListener('keydown', (e) => {
    if ((e.key === 'Backspace' || (e.ctrlKey && e.key === 'x'))) {
        const line = document.elementFromPoint(e.clientX, e.clientY);
        if (line.classList.contains('line')) {
            const connection = connections.find(conn => conn.line === line);
            if (connection) {
                const { start, end } = connection;
                unlockElements(start, end);
                workspace.removeChild(line);
                connections = connections.filter(conn => conn !== connection);
            }
        }
        const block = document.elementFromPoint(e.clientX, e.clientY).closest('.gate, .output');
        if (block) {
            block.querySelectorAll('.connector').forEach(connector => {
                const connection = connections.find(conn => conn.start === connector || conn.end === connector);
                if (connection) {
                    const { line, start, end } = connection;
                    workspace.removeChild(line);
                    connections = connections.filter(conn => conn !== connection);
                    unlockElements(start, end);
                }
            });
            workspace.removeChild(block);
        }
    }
});

function updateLine(e) {
    const rect = workspace.getBoundingClientRect();
    const start = startConnector.getBoundingClientRect();
    const x1 = start.left + start.width / 2 - rect.left;
    const y1 = start.top + start.height / 2 - rect.top;
    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    drawingLine.style.width = `${length}px`;
    drawingLine.style.transform = `rotate(${angle}deg)`;
    drawingLine.style.left = `${x1}px`;
    drawingLine.style.top = `${y1}px`;
}

function connectLine(start, end, line) {
    const rect = workspace.getBoundingClientRect();
    const startRect = start.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();
    const x1 = startRect.left + startRect.width / 2 - rect.left;
    const y1 = startRect.top + startRect.height / 2 - rect.top;
    const x2 = endRect.left + endRect.width / 2 - rect.left;
    const y2 = endRect.top + endRect.height / 2 - rect.top;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
}

function lockElements(start, end) {
    start.parentElement.draggable = false;
    end.parentElement.draggable = false;
    start.parentElement.addEventListener('dragstart', preventDrag);
    end.parentElement.addEventListener('dragstart', preventDrag);
}

function unlockElements(start, end) {
    start.parentElement.draggable = true;
    end.parentElement.draggable = true;
    start.parentElement.removeEventListener('dragstart', preventDrag);
    end.parentElement.removeEventListener('dragstart', preventDrag);
}

function preventDrag(e) {
    e.preventDefault();
}

