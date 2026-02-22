const addButton = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("total");
const doneCount = document.getElementById("done");
const textInput = document.getElementById("textinput");
console.log(addButton);
addButton.addEventListener("click", function()
{  
    totalCount.textContent = Number(totalCount.textContent)+ 1;
    let li = document.createElement("li");
    let task = document.createTextNode(textInput.value);
    li.appendChild(task);
    taskList.appendChild(li);
});
taskList.addEventListener("click", function(event)
{  
    if (event.target.tagName === "LI"){
        event.target.classList.toggle("done");
        if(event.target.classList.contains("done")){
            doneCount.textContent = Number(doneCount.textContent)+ 1;
        }
        else{
            doneCount.textContent = Number(doneCount.textContent)- 1;
        }
    }
});