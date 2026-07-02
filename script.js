// ============================
// TASKFLOW DASHBOARD
// ============================

let tasks =
JSON.parse(
    localStorage.getItem("tasks")
) || [];

let currentFilter = "all";
let currentEditId = null;
let chart = null;


// ============================
// PAGE LOAD
// ============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderTasks();
        updateStats();
        updateAnalytics();
        loadTheme();
        startClock();


        document
        .getElementById(
            "search"
        )
        .addEventListener(
            "input",
            renderTasks
        );


        // ENTER KEY TO ADD TASK

        document
        .getElementById(
            "taskInput"
        )
        .addEventListener(
            "keydown",
            function(e){

                if(
                    e.key==="Enter"
                ){
                    addTask();
                }

            }
        );

    }
);


// ============================
// UNIQUE ID
// ============================

function createId(){

    return crypto.randomUUID
    ?
    crypto.randomUUID()
    :
    Date.now();

}



// ============================
// LIVE CLOCK
// ============================

function startClock(){

    updateClock();

    setInterval(
        updateClock,
        1000
    );

}

function updateClock(){

    document
    .getElementById(
        "clock"
    )
    .innerHTML =

    new Date()
    .toLocaleString(
        "en-IN",
        {
            weekday:"short",
            day:"numeric",
            month:"short",
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        }
    );

}



// ============================
// ADD TASK
// ============================

function addTask(){

    let text =

    document
    .getElementById(
        "taskInput"
    )
    .value
    .trim();


    let dueDate =

    document
    .getElementById(
        "dueDate"
    )
    .value;


    let priority =

    document
    .getElementById(
        "priority"
    )
    .value;



    if(text===""){

        alert(
            "Please enter a task"
        );

        return;

    }



    tasks.push({

        id:createId(),

        text:text,

        date:dueDate,

        priority:priority,

        completed:false

    });


    clearInputs();

    save();

}



// ============================
// RENDER TASKS
// ============================

function renderTasks(){

    let container=

    document.getElementById(
        "taskList"
    );

    container.innerHTML="";


    let search=

    document
    .getElementById(
        "search"
    )
    .value
    .toLowerCase();


    let filteredTasks=

    tasks.filter(task=>{


        let match=

        task.text
        .toLowerCase()
        .includes(
            search
        );


        if(
            currentFilter==="completed"
        ){

            return(
                task.completed &&
                match
            );

        }


        if(
            currentFilter==="pending"
        ){

            return(
                !task.completed &&
                match
            );

        }

        return match;

    });



    filteredTasks.forEach(task=>{

        let div=

        document.createElement(
            "div"
        );

        div.className=
        "task";


        div.innerHTML=`

        <h3 class="${
            task.completed
            ?
            "completed"
            :
            ""
        }">

        ${task.text}

        </h3>

        <p>
        📅 ${task.date || "No date"}
        </p>

        <p>
        ⚡ ${task.priority}
        </p>

        <p>

        ${
            task.completed

            ?

            '<span style="color:#22c55e">✅ Completed</span>'

            :

            '<span style="color:#f59e0b">🕒 Pending</span>'

        }

        </p>


        <div class="actions">

        <button
        class="complete"
        onclick="toggleTask('${task.id}')">

        ✓

        </button>


        <button
        class="edit"
        onclick="editTask('${task.id}')">

        ✏

        </button>


        <button
        class="delete"
        onclick="deleteTask('${task.id}')">

        🗑

        </button>

        </div>

        `;

        container.appendChild(
            div
        );

    });

}



// ============================
// COMPLETE TASK
// ============================

function toggleTask(id){

    tasks=

    tasks.map(task=>{

        return task.id===id

        ?

        {
            ...task,
            completed:
            !task.completed
        }

        :

        task;

    });

    save();

}



// ============================
// DELETE
// ============================

function deleteTask(id){

    tasks=

    tasks.filter(
        task=>
        task.id!==id
    );

    save();

}



// ============================
// EDIT
// ============================

function editTask(id){

    currentEditId=id;


    let task=

    tasks.find(
        t=>t.id===id
    );


    document
    .getElementById(
        "editTaskInput"
    )
    .value=
    task.text;


    document
    .getElementById(
        "editModal"
    )
    .style.display=
    "flex";

}



function saveEditedTask(){

    let value=

    document
    .getElementById(
        "editTaskInput"
    )
    .value
    .trim();


    if(value===""){
        return;
    }


    tasks=

    tasks.map(task=>{

        return task.id===currentEditId

        ?

        {
            ...task,
            text:value
        }

        :

        task;

    });


    closeModal();

    save();

}



function closeModal(){

    document
    .getElementById(
        "editModal"
    )
    .style.display=
    "none";

}



// ============================
// FILTER
// ============================

function filterTasks(type){

    currentFilter=
    type;

    renderTasks();

}



// ============================
// SECTION
// ============================

function showSection(
    section,
    element
){

    document
    .querySelectorAll(
        ".section"
    )
    .forEach(sec=>{

        sec.classList.remove(
            "active-section"
        );

    });


    document
    .getElementById(
        section+"Section"
    )
    .classList.add(
        "active-section"
    );


    document
    .querySelectorAll(
        ".sidebar li"
    )
    .forEach(li=>{

        li.classList.remove(
            "active"
        );

    });


    element.classList.add(
        "active"
    );

}



// ============================
// STATS
// ============================

function updateStats(){

    let total=
    tasks.length;

    let completed=

    tasks.filter(
        t=>t.completed
    ).length;


    let pending=
    total-completed;


    document
    .getElementById(
        "total"
    ).innerText=
    total;


    document
    .getElementById(
        "completed"
    ).innerText=
    completed;


    document
    .getElementById(
        "pending"
    ).innerText=
    pending;


    let progress=

    total

    ?

    (
        completed/
        total
    )
    *
    100

    :

    0;


    document
    .getElementById(
        "progressText"
    )
    .innerText=

    Math.round(
        progress
    )+"%";


    document
    .getElementById(
        "bar"
    )
    .style.width=

    progress+"%";

}



// ============================
// ANALYTICS + GRAPH
// ============================

function updateAnalytics() {

    let high =
        tasks.filter(
            t => t.priority === "high"
        ).length;


    let medium =
        tasks.filter(
            t => t.priority === "medium"
        ).length;


    let low =
        tasks.filter(
            t => t.priority === "low"
        ).length;


    let completed =
        tasks.filter(
            t => t.completed
        ).length;


    let pending =
        tasks.length - completed;



    highCount.innerText =
        high;


    mediumCount.innerText =
        medium;


    lowCount.innerText =
        low;



    document
        .getElementById(
            "overallGraph"
        )
        .innerHTML = `

        <div
            style="
                height:25px;
                background:#1e293b;
                border-radius:20px;
                overflow:hidden;
            "
        >

            <div
                style="
                    width:${
                        tasks.length
                        ?
                        (completed / tasks.length) * 100
                        :
                        0
                    }%;

                    height:100%;

                    background:
                    linear-gradient(
                        90deg,
                        #22c55e,
                        #3b82f6
                    );
                "
            >
            </div>

        </div>

        <p>

            Completed:
            ${completed}

            |

            Pending:
            ${pending}

        </p>

    `;



    document
        .getElementById(
            "priorityGraph"
        )
        .innerHTML = `

        <div
            style="
                display:flex;
                flex-direction:column;
                gap:15px;
                margin-top:20px;
            "
        >

            <div>

                <p>
                    High Priority (${high})
                </p>

                <div
                    style="
                        height:15px;
                        background:#1e293b;
                        border-radius:10px;
                    "
                >

                    <div
                        style="
                            width:${
                                tasks.length
                                ?
                                (high/tasks.length)*100
                                :
                                0
                            }%;

                            height:100%;
                            background:#ef4444;
                            border-radius:10px;
                        "
                    ></div>

                </div>

            </div>



            <div>

                <p>
                    Medium Priority (${medium})
                </p>

                <div
                    style="
                        height:15px;
                        background:#1e293b;
                        border-radius:10px;
                    "
                >

                    <div
                        style="
                            width:${
                                tasks.length
                                ?
                                (medium/tasks.length)*100
                                :
                                0
                            }%;

                            height:100%;
                            background:#f59e0b;
                            border-radius:10px;
                        "
                    ></div>

                </div>

            </div>



            <div>

                <p>
                    Low Priority (${low})
                </p>

                <div
                    style="
                        height:15px;
                        background:#1e293b;
                        border-radius:10px;
                    "
                >

                    <div
                        style="
                            width:${
                                tasks.length
                                ?
                                (low/tasks.length)*100
                                :
                                0
                            }%;

                            height:100%;
                            background:#22c55e;
                            border-radius:10px;
                        "
                    ></div>

                </div>

            </div>

        </div>

    `;

}

function showPriorityTasks(priority) {

    currentFilter = "all";


    let filtered =

        tasks.filter(
            task => task.priority === priority
        );


    let completed =

        filtered.filter(
            task => task.completed
        ).length;


    let pending =
        filtered.length - completed;



    document
        .getElementById(
            "overallGraph"
        )
        .innerHTML = `

        <h3>
            ${priority.toUpperCase()} Priority Analytics
        </h3>

        <div
            style="
                height:25px;
                background:#1e293b;
                border-radius:20px;
                overflow:hidden;
                margin-top:15px;
            "
        >

            <div
                style="
                    width:${
                        filtered.length
                        ?
                        (completed / filtered.length) * 100
                        :
                        0
                    }%;

                    height:100%;

                    background:
                    linear-gradient(
                        90deg,
                        #ef4444,
                        #22c55e
                    );
                "
            >
            </div>

        </div>

        <p style="margin-top:15px">

            Total :
            ${filtered.length}

            <br>

            Completed :
            ${completed}

            <br>

            Pending :
            ${pending}

        </p>

    `;



    let taskContainer =

        document.getElementById(
            "priorityGraph"
        );


    taskContainer.innerHTML = "";


    filtered.forEach(task => {

        taskContainer.innerHTML += `

        <div
            style="
                background:#0f172a;
                padding:15px;
                border-radius:12px;
                margin-top:15px;
            "
        >

            <h4>

                ${task.text}

            </h4>

            <p>

                📅 ${task.date || "No date"}

            </p>

            <p>

                ${
                    task.completed

                    ?

                    "✅ Completed"

                    :

                    "🕒 Pending"
                }

            </p>

        </div>

        `;

    });

}



// ============================
// SAVE
// ============================

function save(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(
            tasks
        )
    );

    renderTasks();
    updateStats();
    updateAnalytics();

}



// ============================
// INPUTS
// ============================

function clearInputs(){

    taskInput.value="";
    dueDate.value="";

}



// ============================
// THEME
// ============================

function toggleTheme() {

    document.body.classList.toggle(
        "light"
    );


    let isLight =

        document.body
        .classList
        .contains(
            "light"
        );


    localStorage.setItem(
        "theme",
        isLight
    );

}



function loadTheme() {

    let savedTheme =

        localStorage.getItem(
            "theme"
        );


    if (
        savedTheme === "true"
    ) {

        document.body
        .classList.add(
            "light"
        );

    }
    else {

        document.body
        .classList.remove(
            "light"
        );

    }

}



// ============================
// SETTINGS
// ============================

function clearAllTasks(){

    if(
        confirm(
            "Delete all tasks?"
        )
    ){

        tasks=[];

        save();

    }

}


function exportTasks(){

    let blob=

    new Blob(
        [
            JSON.stringify(
                tasks,
                null,
                2
            )
        ]
    );

    let a=
    document.createElement(
        "a"
    );

    a.href=
    URL.createObjectURL(
        blob
    );

    a.download=
    "tasks.json";

    a.click();

}


function importTasks(){

    let input=
    document.createElement(
        "input"
    );

    input.type=
    "file";

    input.onchange=(e)=>{

        let file=
        e.target.files[0];

        let reader=
        new FileReader();

        reader.onload=()=>{

            tasks=
            JSON.parse(
                reader.result
            );

            save();

        };

        reader.readAsText(
            file
        );

    };

    input.click();

}



function resetApp(){

    localStorage.clear();

    location.reload();

}