//cell states
var field = [];

//update
var intervalId;

//pause
var active = false;

//elements
var table, btnStart, btnPause, btnReset;

function Onload()
{
    btnStart = document.getElementById("btnStart");
    btnPause = document.getElementById("btnPause");
    btnReset = document.getElementById("btnReset");

    ToggleButtons(btnStart, btnPause);

    table = document.getElementById("table");
    table.innerHTML = "";
    field = [];

    var innerHTML = "";

    //row
    for (var i = 0; i < 64; i++)
    {
        var row = [];
        innerHTML += "<tr>";

        //cell
        for (var j = 0; j < 64; j++)
        {
            innerHTML += "<td onclick='ToggleCell(this)' style='background-color: rgb(18, 18, 18);'></td>";
            row.push("Dead");
        }
        innerHTML += "</tr>";
        field.push(row);
    }
    table.innerHTML = innerHTML;
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

    active = true;

    //call update every 50ms
    intervalId = window.setInterval(function(){
        UpdateField();
      }, 100);
}

function Pause()
{
    ToggleButtons(btnStart, btnPause);

    active = false;

    clearInterval(intervalId);
}

function ToggleButtons (button1, button2)
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

function Reset()
{
    Pause();
    Onload();
}

function UpdateField()
{
    //row
    for (var i = 0; i < 64; i++)
    {
        //cell
        for (var j = 0; j < 64; j++)
        {
            var neighbours = 0;
            
            //check up
            if (i != 0)
            {
                neighbours += CheckNeighbours(i - 1, j);
            }

            //check down
            if (i != 63)
            {
                neighbours += CheckNeighbours(i + 1, j);
            }

            //check left
            if (j != 0)
            {
                neighbours += CheckNeighbours(i, j - 1);
            }

            //check right
            if (j != 63)
            {
                neighbours += CheckNeighbours(i, j + 1);
            }

            //check up-left
            if (i != 0 && j != 0)
            {
                neighbours += CheckNeighbours(i - 1, j - 1);
            }

            //check up-right
            if (i != 0 && j != 63)
            {
                neighbours += CheckNeighbours(i - 1, j + 1);
            }

            //check down-left
            if (i != 63 && j != 0)
            {
                neighbours += CheckNeighbours(i + 1, j - 1);
            }

            //check down-right
            if (i != 63 && j != 63)
            {
                neighbours += CheckNeighbours(i + 1, j + 1);
            }

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
    for (var i = 0; i < 63; i++)
    {
        for (var j = 0; j < 63; j++)
        {
            if (field[i][j] == "Alive")
            {
                table.rows[i].cells[j].style.backgroundColor = "rgb(227, 227, 227)";
            }
            else
            {
                table.rows[i].cells[j].style.backgroundColor = "rgb(18, 18, 18)";
            }
        }
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