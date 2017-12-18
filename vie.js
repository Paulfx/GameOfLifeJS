let c_canvas = document.getElementById("c");
let context = c_canvas.getContext("2d");

let tCanvas = 3000;

let nbCases = 1225;
let divise = 35;

let longueur = Math.floor(tCanvas / divise);

var PAUSE = true;


//Event listener

c_canvas.addEventListener("mousedown", getPosition, false);

function getPosition(event) {

  let x = 0;
  let y = 0;

  if (event.x != undefined && event.y != undefined)
  {
    x = event.x - c_canvas.offsetLeft;
    y = event.y- c_canvas.offsetTop;
    
    if (grid != undefined) {
      x = Math.floor(x / longueur);
      y = Math.floor(y / longueur);

      if( grid[x][y].color == 1) {
       grid[x][y].oldColor = 0;
       grid[x][y].color = 0; 
      }
      else {
       grid[x][y].oldColor = 1;
       grid[x][y].color = 1;
      }

      draw(grid);
    }

  }

}

function pause() {
  if (PAUSE == true) {
    
    PAUSE = false;
  }
  else PAUSE = true;

}

function clearGrid() {
  console.log("clear");
  for (let i = 0; i < divise; i += 1) {
    for (let j = 0; j < divise; j += 1) {
      grid[i][j].color = 0;
      grid[i][j].oldColor = 0;
    }
  }
  draw(grid);
}

//Cellule

class Cellule {

  constructor(i, j, c, max) {
    this.i = i;
    this.j = j;
    this.color = c;
    this.oldColor = c;
    this.newColor = c;
    this.neighbours = [];
    this.initNeighbours(max);
  }

  initNeighbours(max) {
    if (this.test(this.i-1,this.j-1, max)) this.neighbours.push([this.i-1,this.j-1]);
    if (this.test(this.i-1,this.j, max)) this.neighbours.push([this.i-1,this.j]);
    if (this.test(this.i-1,this.j+1, max)) this.neighbours.push([this.i-1,this.j+1]);
    if (this.test(this.i,this.j-1, max)) this.neighbours.push([this.i,this.j-1]);
    if (this.test(this.i,this.j+1, max)) this.neighbours.push([this.i,this.j+1]);
    if (this.test(this.i+1,this.j-1, max)) this.neighbours.push([this.i+1,this.j-1]);
    if (this.test(this.i+1,this.j, max)) this.neighbours.push([this.i+1,this.j]);
    if (this.test(this.i+1,this.j+1, max)) this.neighbours.push([this.i+1,this.j+1]);
  }

  test(i, j, max) {
    if (i == -1 ||
        i == max ||
        j == -1 ||
        j == max) return false;
    return true;
  }
}

//Draw

function draw(grid) {
  
  for (let i = 0; i < divise; i += 1) {
    for (let j = 0; j < divise; j += 1) {
      if (grid[i][j].color == 0) {
        //Morte
        if(grid[i][j].oldColor == 1) color = "#F9B3EB";
        else color = "#FFFFFF";
      }
      else {
        //Vivante
        if (grid[i][j].oldColor == 0) color = "#14E4E8";
        else color = "#0000FF";
      }
      context.fillStyle = color;
      context.fillRect(i*longueur, j*longueur, i*longueur + longueur, j*longueur + longueur);
    }


  }
  
}

function drawGrid() {
  context.beginPath();
  for (let i = 0; i < divise; i += 1) {
    context.moveTo(Math.floor(i*longueur), 0);
    console.log("str");
    context.lineTo(tCanvas + Math.floor(i*longueur), 0);
    context.moveTo(0, Math.floor(i*longueur));
    context.lineTo(0, tCanvas + Math.floor(i*longueur));
  }
  context.strokeStyle = "#000000";
  context.linewidth = 50;
  context.stroke();
}

function update(grid) {

  for (let i = 0; i < grid.length; i++) {
    
    for (let j = 0; j < grid[i].length; j++) {
      let neighbours = grid[i][j].neighbours;

      //

      //On compte nbr de vivants
      let nbAlive = 0;

      for (let n = 0; n < neighbours.length; n++) {
          let pos = neighbours[n];
          if (grid[pos[0]][pos[1]].color == 1) nbAlive++;
      }
      if (grid[i][j].color == 1)
        console.log("VIVANT");
      if (nbAlive > 0)
        console.log(nbAlive + " i : "+i+" j : "+j);
      if (grid[i][j].color == 0) {
        //Morte
        if (nbAlive == 3) grid[i][j].newColor = 1;
        else grid[i][j].newColor = grid[i][j].color;
      }

      else {
        //Vivante
        
        if (nbAlive < 2 || nbAlive > 3) grid[i][j].newColor = 0;
        else grid[i][j].newColor = grid[i][j].color;
      }

    }
  }

  //Sauvegarde ancienne couleur

  for (let i = 0; i < grid.length; i++) {
    
    for (let j = 0; j < grid[i].length; j++) {

      grid[i][j].oldColor = grid[i][j].color;
      grid[i][j].color = grid[i][j].newColor;

    }
  }

}




// Init grid

let grid = [];
let c = 0;
for (let i = 0; i < divise; i++) {
    grid[i] = [];
    for (let j = 0; j < divise; j++) {
      if (i == 7 && j == 7) c = 1;
      else if (i == 6 && j == 7) c = 1;
      else if (i == 8 && j == 7) c = 1;
      else if (i == 7 && j == 5) c = 1;
      else if (i == 8 && j == 6) c = 1;

      else c = 0;
      grid[i][j] = new Cellule(i, j, c, divise);
   }
}




update(grid);
draw(grid);
var b = false;
setInterval(function() {
      if(!PAUSE) {
        console.log("-------------");
        if (!b) {
                update(grid);
                draw(grid); 
            }
        else b = false;

            }
            else b = true;} , 150);
        
