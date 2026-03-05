// // import { json2xml } from "https://cdn.skypack.dev/xml-js";
// var js2xmlparser = require("js2xmlparser");

const key = "mbqZPXgCNseuUso0ISDnEFbooKeHOJzU";
const gifTag = "cat";
const base_url = "https://api.giphy.com/v1/gifs/random"

let tasks = [];
let stats = {
    totalCount: 0,
    doneCount: 0,
}

const addButton = document.getElementById("addBtn");
const xmlButton = document.getElementById("xmlBtn");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("total");
const doneCount = document.getElementById("done");
const textInput = document.getElementById("textinput");
const form = document.querySelector("form");
const header = document.querySelector("header");

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
    convertToXml(){
        let xml = `<task>\n`;
        xml += `<text>${this.text}</text>\n`;
        xml += `<done>${this.done}</done>\n`;
        xml += `<id>${this.id}</id>\n`;
        xml += `</task>\n`;
        return xml;

    }
}


function createNewTask(textInputValue, doneValue, id=undefined){
    const newTask = new Task(textInputValue, doneValue, id); 
    tasks.push(newTask);
    return newTask;

}
function changeDoneStatus(id){
    const task = tasks.find(task => task.id === id);
    task.doneToggle();
}
function saveChanges()
{
    localStorage.setItem("tasksJson", JSON.stringify(tasks)); 
}
function createXMLString(){
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<tasks>\n`;
    tasks.forEach(task => {
        xml += task.convertToXml();
    });
    xml += `</tasks>\n`;
    console.log(xml);
    return xml;
}
function writeToFile(content, path, contentType){
    const link = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    link.href = URL.createObjectURL(file);
    link.download = path;
    link.click();
    URL.revokeObjectURL(link.href);
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
function renderGif(gif){
    const gifElement = document.createElement("img");
    gifElement.src = gif.images.original.url;
    gifElement.alt = gif.title;
    header.appendChild(gifElement);
}

async function getGif() {
    try{
        const response =  await fetch(`${base_url}?api_key=${key}&tag=${gifTag}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        if(result){
            gif = result.data;
            renderGif(gif);
        }
    }
    catch(error){
        console.log(error);
    }

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
        const taskElement = event.target;
        taskElement.classList.toggle("done");
        const taskId = taskElement.dataset.id;
        changeDoneStatus(taskId);
        renderStats();
    }
    saveChanges();
});
xmlButton.addEventListener("click", function(){
    const xmlString = createXMLString();
    writeToFile(xmlString, "tasks.xml", "text/xml");
});
form.addEventListener("keydown", function(event)
{
    if(event.key == "Enter")
    {
        event.preventDefault();
        return;
    }
});


window.addEventListener("DOMContentLoaded", () => {
    loading();  
    getGif();

});

