
//Get All Tasks
const showAllTasks = (res)=>{
    const tasksContainer = document.getElementById("tasksList");
    res.forEach(task => {
        //single task
        const taskContainer = document.createElement('div');
        taskContainer.classList.add("singleTask");
        const taskName = document.createElement("h2");
        taskName.classList.add("taskName");
        taskName.setAttribute("id",`${task._id}`)
        taskName.textContent = task.name;
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn","btn");
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.userId = task._id;
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'
        const updateBtn = document.createElement("button");
        updateBtn.classList.add("updateBtn","btn");
        updateBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
        updateBtn.dataset.userId = task._id;
        const btnContainer = document.createElement("div");
        btnContainer.appendChild(updateBtn)
        btnContainer.appendChild(deleteBtn)
        taskContainer.appendChild(taskName);
        taskContainer.appendChild(btnContainer);
        tasksContainer.appendChild(taskContainer);
        //delete task
        const deleteBtns = document.querySelector(".deleteBtn");
        deleteBtn.addEventListener("click",(e)=>{
            console.log(e.target);
            const dataId = e.target.parentNode.getAttribute("data-user-id");
            const parent = e.target.parentNode.parentNode.parentNode;
            axios.delete(`api/v1/tasks/${dataId}`)
            .then(res=>{
                console.log(res);
                parent.remove();
            }).catch(error=>{
                console.log(error);
            })
        })
        //edit task
        let isCompleted ;
        updateBtn.addEventListener("click",(e)=>{
            console.log(task.discreption);
            const popup = document.createElement("div");
            popup.setAttribute("id",`popup${task._id}`);
            popup.classList.add("popup")
            popup.innerHTML = `<div class="topSection" style="
            display: flex;
            justify-content: space-between;
            "><h2>Edit Task</h2> <button class="closeBtn">x</button></div>
            <div class="fields"><input type="text" class="nameField" value='${task.name}'/>
            <textarea type"text" class="discreption" value=''>${task.discreption}</textarea>
            <input type="datetime-local" class="updateStartTime" />
            <input type="datetime-local" class="updateEndTime" />
            </div>
            <div><input type="checkbox"class="check"/></div>
            <div class="footer"><button class="editBtn">Edit</button></div>
            </div>`;
            const body = document.body;
            document.body.appendChild(popup);
            //update task
            const editBtn = document.querySelector(".editBtn");
            const closeBtn = document.querySelector(".closeBtn");
            const nameField = document.querySelector(".nameField");
            const discreptionField = document.querySelector(".discreption")
            const updateStartTime = document.querySelector(".updateStartTime");
            const updateEndTime = document.querySelector(".updateEndTime");
            ///////
            const utcTimeS = `${task.startTime}`;
            const date = new Date(utcTimeS);
            updateStartTime.value = date.toISOString().substring(0,16);
            console.log(task.endTime);
            const utcTimeE = `${task.endTime}`;
            const date2 = new Date(utcTimeE);
            updateEndTime.value = date2.toISOString().substring(0,16);
            //////////
            const completed = document.querySelector(".check");
            task.completed? completed.checked = true : completed.checked = false;
            completed.addEventListener("click",(e)=>{
                !e.target.checked ? isCompleted=false:isCompleted=true;
            })
            editBtn.addEventListener("click",()=>{
                console.log(task._id);
                console.log(nameField.value);
                console.log(updateStartTime.value,"up");
                axios.patch(`api/v1/tasks/${task._id}`,{
                    name: `${nameField.value}`,
                    discreption: `${discreptionField.value}`,
                    startTime:updateStartTime.value,
                    completed: isCompleted,
                }).then(res=> console.log(res))
            })
            closeBtn.addEventListener("click",()=>{
                const oneTask = document.getElementById(`popup${task._id}`);
                oneTask.remove()
            })
        })
        if(task.completed){
            const taskNameStyle = document.getElementById(`${task._id}`);
            console.log(task.name);
            taskNameStyle.style.textDecoration = "line-through"
        }
    });
}
    axios.get("api/v1/tasks").then(res=>showAllTasks(res.data.data.tasks))
    .catch( error => console.log(error))

    const form = document.getElementById("tasksForm");
    const newTaskInputs = document.getElementById("tasksForm");
    const pluseBtn = document.getElementById("pluse")
    pluseBtn.addEventListener("click",()=>{
        newTaskInputs.style.display = "flex"
    })
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        //create task 
        const date = new Date();
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); 
        e.target.children[0].children[2].value = localDate.toISOString().substring(0, 16);
        const formData = new FormData(e.target);
        console.log(formData);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
        axios.post("api/v1/tasks",formDataObj)
        .then(res=>console.log(res))
        .catch(error=>console.log(error))
        //add new task
        axios.get("api/v1/tasks").then(res=>{
            const singleTaskArr = [res.data.data.tasks[res.data.data.tasks.length-1]]
            showAllTasks(singleTaskArr)})
        .catch( error => console.log(error))
    })
 



