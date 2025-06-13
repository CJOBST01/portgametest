const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const rows = 20;
const cols = 20;
const cellSize = canvas.width / cols;
let grid = [];
let isMouseDown = false;

let start = [0, 0];
let end = [cols - 1, rows - 1];

function createGrid() {
  grid = new Array(rows).fill(null).map(() =>
    new Array(cols).fill(0)
  );
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (x === start[0] && y === start[1]) {
        ctx.fillStyle = "green";
      } else if (x === end[0] && y === end[1]) {
        ctx.fillStyle = "red";
      } else if (grid[y][x] === 1) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  toggleWall(e);
});
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});
canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) toggleWall(e);
});

function toggleWall(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  if (
    (x !== start[0] || y !== start[1]) &&
    (x !== end[0] || y !== end[1])
  ) {
    grid[y][x] = grid[y][x] === 1 ? 0 : 1;
    drawGrid();
  }
}

function solveMaze() {
  const queue = [[...start]];
  const visited = new Set();
  const parent = {};

  const key = (x, y) => `${x},${y}`;
  visited.add(key(...start));

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x === end[0] && y === end[1]) {
      // backtrack
      let path = [end];
      let k = key(...end);
      while (parent[k]) {
        path.unshift(parent[k]);
        k = key(...parent[k]);
      }
      drawGrid();
      for (let [px, py] of path) {
        if ((px !== start[0] || py !== start[1]) &&
            (px !== end[0] || py !== end[1])) {
          ctx.fillStyle = "lightblue";
          ctx.fillRect(px * cellSize, py * cellSize, cellSize, cellSize);
        }
      }
      return;
    }

    for (let [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        ny >= 0 &&
        nx < cols &&
        ny < rows &&
        grid[ny][nx] === 0 &&
        !visited.has(key(nx, ny))
      ) {
        visited.add(key(nx, ny));
        parent[key(nx, ny)] = [x, y];
        queue.push([nx, ny]);
      }
    }
  }

  alert("No path found!");
}

function randomMap() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if ((x === start[0] && y === start[1]) || (x === end[0] && y === end[1])) {
        grid[y][x] = 0;
      } else {
        grid[y][x] = Math.random() < 0.3 ? 1 : 0;
      }
    }
  }
  drawGrid();
}

document.getElementById("resetBtn").addEventListener("click", () => {
  createGrid();
  drawGrid();
});
document.getElementById("randomBtn").addEventListener("click", () => {
  randomMap();
});
document.getElementById("solveBtn").addEventListener("click", () => {
  solveMaze();
});

createGrid();
drawGrid();
