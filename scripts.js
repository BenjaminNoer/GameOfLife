//cell states
var field = [];

//update and interval
var intervalId, interval = 100;;

//pause
var active = false;

//elements
var table, btnStart, btnPause, btnReset;

//table size
var max = 32;

function Onload()
{
    clearInterval(intervalId);
    active = false;
    btnStart = document.getElementById("btnStart");
    btnPause = document.getElementById("btnPause");
    btnReset = document.getElementById("btnReset");

    ToggleButtons(btnStart, btnPause);

    table = document.getElementById("table");
    table.innerHTML = "";
    field = [];

    var innerHTML = "";

    //row
    for (var i = 0; i < max; i++)
    {
        var row = [];
        innerHTML += "<tr>";
        for (var j = 0; j < max; j++)
        {
            innerHTML += "<td onclick='ToggleCell(this)' style='background-color: rgb(18, 18, 18);'></td>";
            row.push("Dead");
        }
        innerHTML += "</tr>";
        field.push(row);
    }
    table.innerHTML = innerHTML;

    ResizeTable();
}

function ResizeTable()
{
    var size = 0;

    if (window.innerHeight <= window.innerWidth)
    {
        size = window.innerHeight;
    }
    else
    {
        size = window.innerWidth;
    }

    var height = document.getElementById("buttons").scrollHeight + 50;
    table.style.width = (size - height) + "px";
    table.style.height = (size - height) + "px";
}

function ChangeSize()
{
    var input = document.getElementById("numericInput").value;

    if (!(input > 128) && !(input < 16))
    {
        max = input;
    }
    else if (input > 128)
    {
        document.getElementById("numericInput").value = 128;
    }
    else
    {
        document.getElementById("numericInput").value = 16;
    }

    Onload();
}

function ToggleCell(cell)
{
    if (!active)
    {
        var cellIndex = cell.cellIndex;
        var rowIndex = cell.parentNode.rowIndex;
        if (cell.style.backgroundColor == "rgb(18, 18, 18)")
        {
            cell.style.backgroundColor = "rgb(227, 227, 227)";
            field[rowIndex][cellIndex] = "Alive";
        }
        else
        {
            cell.style.backgroundColor = "rgb(18, 18, 18)";
            field[rowIndex][cellIndex] = "Dead";
        }
    }
}

function Start()
{
    ToggleButtons(btnPause, btnStart);
    ToggleCellCursor(false);

    active = true;

    //call update
    intervalId = window.setInterval(function(){
        UpdateField();
      }, interval);
}

function Pause()
{
    ToggleButtons(btnStart, btnPause);
    ToggleCellCursor(true);

    active = false;

    clearInterval(intervalId);
}

function ToggleButtons(button1, button2)
{
    button1.disabled = false;
    button2.disabled = true;

    button2.classList.add("buttonDisabled");
    button2.classList.remove("button");
    button2.style.opacity = "50%";

    button1.classList.add("button");
    button1.classList.remove("buttonDisabled");
    button1.style.opacity = "100%";
}

function ToggleCellCursor(isPointer)
{
    var value = "";

    if (isPointer)
    {
        value = "pointer";
    }
    else
    {
        value = "default";
    }

    var cells = document.getElementsByTagName("td");

    for (var i = 0; i < cells.length; i++)
    {
        cells[i].style.cursor = value;
    }
}

function Reset()
{
    Pause();
    Onload();
}

function UpdateField()
{
    //row
    for (var i = 0; i < max; i++)
    {
        //cell
        for (var j = 0; j < max; j++)
        {
            var neighbours = 0;
            
            //normal checks
            //check up
            if (i != 0)
            {
                neighbours += CheckNeighbours(i - 1, j);
            }
            else
            {
                neighbours += CheckNeighbours(max - 1, j);
            }

            //check down
            if (i != max - 1)
            {
                neighbours += CheckNeighbours(i + 1, j);
            }
            else
            {
                neighbours += CheckNeighbours(0, j);
            }

            //check left
            if (j != 0)
            {
                neighbours += CheckNeighbours(i, j - 1);
            }
            else
            {
                neighbours += CheckNeighbours(i, max - 1);
            }

            //check right
            if (j != max - 1)
            {
                neighbours += CheckNeighbours(i, j + 1);
            }
            else
            {
                neighbours += CheckNeighbours(i, 0);
            }

            //diagonal checks
            //check up-left
            if (i != 0 && j != 0)
            {
                neighbours += CheckNeighbours(i - 1, j - 1);
            }
            else if (i == 0 && j != 0)
            {
                neighbours += CheckNeighbours(max - 1, j - 1);
            }
            else if (i != 0 && j == 0)
            {
                neighbours += CheckNeighbours(i - 1, max - 1);
            }
            else
            {
                neighbours += CheckNeighbours(max - 1, max - 1);
            }

            //check up-right
            if (i != 0 && j != max - 1)
            {
                neighbours += CheckNeighbours(i - 1, j + 1);
            }
            else if (i == 0 && j != max - 1)
            {
                neighbours += CheckNeighbours(max - 1, j + 1);
            }
            else if (i != 0 && j == max - 1)
            {
                neighbours += CheckNeighbours(i - 1, 0);
            }
            else
            {
                neighbours += CheckNeighbours(max - 1, 0);
            }

            //check down-left
            if (i != max - 1 && j != 0)
            {
                neighbours += CheckNeighbours(i + 1, j - 1);
            }
            else if (i == max - 1 && j != 0)
            {
                neighbours += CheckNeighbours(0, j - 1);
            }
            else if (i != max - 1 && j == 0)
            {
                neighbours += CheckNeighbours(i + 1, max - 1);
            }
            else
            {
                neighbours += CheckNeighbours(0, max - 1);
            }

            //check down-right
            if (i != max - 1 && j != max - 1)
            {
                neighbours += CheckNeighbours(i + 1, j + 1);
            }
            else if (i == max - 1 && j != max - 1)
            {
                neighbours += CheckNeighbours(0, j + 1);
            }
            else if (i != max - 1 && j == max - 1)
            {
                neighbours += CheckNeighbours(i + 1, 0);
            }
            else
            {
                neighbours += CheckNeighbours(0, 0);
            }

            //apply new states
            if (field[i][j] == "Dead" && neighbours == 3)
            {
                field[i][j] = "Alive"
            }
            else if (field[i][j] == "Alive" && (neighbours < 2 || neighbours > 3))
            {
                field[i][j] = "Dead"
            }
        }
    }

    //Apply update
    var anyAlive = false;

    for (var i = 0; i < max; i++)
    {
        for (var j = 0; j < max; j++)
        {
            if (field[i][j] == "Alive")
            {
                table.rows[i].cells[j].style.backgroundColor = "rgb(227, 227, 227)";
                anyAlive = true;
            }
            else
            {
                table.rows[i].cells[j].style.backgroundColor = "rgb(18, 18, 18)";
            }
        }
    }

    if (!anyAlive)
    {
        Reset();
    }
}

function CheckNeighbours(indexI, indexJ)
{
    if (table.rows[indexI].cells[indexJ].style.backgroundColor == "rgb(18, 18, 18)")
    {
        return 0;
    }
    else
    {
        return 1;
    }
}