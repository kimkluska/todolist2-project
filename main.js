class Task{
    constructor(text, done, id = crypto.randomUUID()){
        this.text = text;
        this.done = done;
        this.id = id;
    }
    get text(){
        return this._text;
    }
    set text(value){
        this._text = value;
    }
    get done(){
        return this._done;
    }
    set done(value){
        this._done = value;
    }
    get id(){
        return this._id;
    }
    set id(value){
        this._id = value;
    }

    doneToggle(){
        this.done = !this.done;

    }
}


let tasks = [];
let stats = {
    totalCount: 0,
    doneCount: 0,
}
const addButton = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("total");
const doneCount = document.getElementById("done");
const textInput = document.getElementById("textinput");
const form = document.querySelector("form");

form.addEventListener("keydown", function(event)
{
    if(event.key == "Enter")
    {
        event.preventDefault();
        return;
    }
});

form.addEventListener("submit", function(event)
{
    event.preventDefault();
    if(textInput.value.trim() == ""){
        return;
    }
    totalCount.textContent = Number(totalCount.textContent)+ 1;
    stats.totalCount += 1;

    const newTask = createNewTask(textInput.value, false);
    renderTask(newTask);

    textInput.value = "";

    saveChanges();
});

taskList.addEventListener("click", function(event)
{  
    if (event.target.tagName === "LI"){
        taskElement = event.target;
        taskElement.classList.toggle("done");
        const taskId = taskElement.dataset.id;
        changeDoneStatus(taskId);
        renderStats();

        // if(event.target.classList.contains("done")){
        //     doneCount.textContent = Number(doneCount.textContent)+ 1;
        //     stats.doneCount += 1;
        // }
        // else{
        //     doneCount.textContent = Number(doneCount.textContent)- 1;
        //     stats.doneCount -= 1;
        // }
    }
    saveChanges();
});

function createNewTask(textInputValue, doneValue, id=undefined){
    const newTask = new Task(textInputValue, doneValue, id); 
    tasks.push(newTask);
    return newTask;

}

function renderTask(newTask)
{
    // const task = new Task(textInputValue, doneValue);
    // task.addTask(task);
    const li = document.createElement("li");
    const taskText = document.createTextNode(newTask.text);
    li.dataset.id = newTask.id;

    if(newTask.done && !li.classList.contains("done")){
        li.classList.add("done");
    }

    li.appendChild(taskText);
    taskList.appendChild(li);
}

function renderTodoList(){
    tasks.forEach(task => {
        renderTask(task);
    });
}

function renderStats(){
    stats.totalCount = tasks.length;
    stats.doneCount = tasks.filter(task => task.done).length;

    totalCount.textContent = stats.totalCount;
    doneCount.textContent = stats.doneCount;
}


function changeDoneStatus(id){
    const task = tasks.find(task => task.id === id);
    task.doneToggle();
}

function saveChanges()
{
    // let tasks = [];
    // const liElements = document.querySelectorAll("#taskList li");
    // liElements.forEach(li => {
    //     const task = {
    //         text: li.textContent,
    //         done: li.classList.contains("done"),
    //     };
    //     tasks.push(task);
    // });
    localStorage.setItem("tasksJson", JSON.stringify(tasks));

    // const stats = {
    //     totalCount: totalCount.textContent,
    //     doneCount: doneCount.textContent,
    // }
    // localStorage.setItem("statsJson", JSON.stringify(stats));
    
}

function loading()
{
    const tasksJson = localStorage.getItem("tasksJson");
    // const statsJson = localStorage.getItem("statsJson");
    if(tasksJson){
        tasks = [];
        const rawTasks = JSON.parse(tasksJson);
        rawTasks.map(task => createNewTask(task._text, task._done, task._id));
        taskList.innerHTML = "";
        renderTodoList();
        renderStats();
        // tasks.forEach(task => {
        //     renderTask(task.text, task.done);
        // });
    }
    // console.log(statsJson);
    // if(statsJson){
    //     stats = JSON.parse(statsJson);
    //     renderStats();
    // }

    // totalCount.textContent = stats.totalCount;
    // doneCount.textContent = stats.doneCount;

}
console.log(tasks);
window.addEventListener("DOMContentLoaded", loading);

