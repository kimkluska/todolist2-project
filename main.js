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
const header = document.querySelector("header");

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
    localStorage.setItem("tasksJson", JSON.stringify(tasks)); 
}

function loading()
{
    const tasksJson = localStorage.getItem("tasksJson");
    if(tasksJson){
        tasks = [];
        const rawTasks = JSON.parse(tasksJson);
        rawTasks.map(task => createNewTask(task._text, task._done, task._id));
        taskList.innerHTML = "";
        renderTodoList();
        renderStats();
    }

}

const key = "mbqZPXgCNseuUso0ISDnEFbooKeHOJzU";
const gifTag = "cat";

fetch(`https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=${gifTag}`)
    .then(function(res){
        return res.json();
    })
    .then(function(res){
        if(res){
            renderGif(res.data);
        }
    })
    .catch(function(err){
        console.log(err);
    });


function renderGif(gif){
    const gifElement = document.createElement("img");
    gifElement.src = gif.images.original.url;
    gifElement.alt = gif.title;
    header.appendChild(gifElement);
}

window.addEventListener("DOMContentLoaded", loading);
