
const API = 'https://taske-manager.vercel.app/api/v1/tasks'
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
            axios.delete(`${API}/${dataId}`)
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
            popup.innerHTML = `<div class="popup2"><div class="topSection" style="
            display: flex;
            justify-content: space-between;
            "><h2>Edit Task</h2> <button class="closeBtn btn"><i class="fa-solid fa-xmark"></i></button></div>
            <div class="fields"><input type="text" class="nameField" value='${task.name}'/>
            <textarea type"text" class="discreption" value=''>${task.discreption}</textarea>
            <input type="datetime-local" class="updateStartTime" />
            <input type="datetime-local" class="updateEndTime" />
            </div>
            <div class="checkCont" style="display: flex; padding: 6px">
            <input type="checkbox"class="check"/>
            <label>Completed</label>
            </div>
            <div class="footer"><button class="editBtn btn">Edit</button></div>
            </div> `;
            const body = document.body;
            document.body.appendChild(popup);
            //style popup
                const popupCont = document.querySelector(".popup2");
                const closeBtn = document.querySelector(".closeBtn");
                const editBtn = document.querySelector(".editBtn");
                const checkboxBtn = document.querySelector(".check");
                popupCont.style.background ="#af7eeb";
                popupCont.style.padding ="30px";
                popupCont.style.borderRadius  ="30px";   
                closeBtn.style.color = "white";
                closeBtn.style.fontSize = "20px";
                editBtn.style.color = "white";
                editBtn.style.fontSize = "20px";
                editBtn.style.padding=" 10px 0 0 0";
                checkboxBtn.style.cursor = "pointer";
            //update task
            const nameField = document.querySelector(".nameField");
            const discreptionField = document.querySelector(".discreption")
            const updateStartTime = document.querySelector(".updateStartTime");
            const updateEndTime = document.querySelector(".updateEndTime");
            //Start Time
            const utcTimeS = `${task.startTime}`;
            const date = new Date(utcTimeS);
            let localDate;
            if(hasDST(new Date(date))){
                localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000 -60*60000); 
            }
            updateStartTime.value = localDate.toISOString().substring(0,16);
            //end Time
            const utcTimeE = `${task.endTime}`;
            console.log(task.endTime);
            const date2 = new Date(utcTimeE);
            let localDate2;
            if(hasDST(new Date(date2))){
                localDate2 = new Date(date2.getTime() - date2.getTimezoneOffset() * 60000 -60*60000); 
            }
            updateEndTime.value = localDate2.toISOString().substring(0,16);
            //chick box
            const completed = document.querySelector(".check");
            task.completed? completed.checked = true : completed.checked = false;
            completed.addEventListener("click",(e)=>{
                !e.target.checked ? isCompleted=false:isCompleted=true;
            })
            //edit button in edit form
            editBtn.addEventListener("click",()=>{
                axios.patch(`${API}/${task._id}`,{
                    name: `${nameField.value}`,
                    discreption: `${discreptionField.value}`,
                    startTime:updateStartTime.value,
                    endTime: updateEndTime.value,
                    completed: isCompleted,
                }).then(res=> console.log(res))
            })
            //close button in edit form
            closeBtn.addEventListener("click",()=>{
                const oneTask = document.getElementById(`popup${task._id}`);
                oneTask.remove()
            })
        })
        //put line over title task if it completed
        if(task.completed){
            const taskNameStyle = document.getElementById(`${task._id}`);
            console.log(task.name);
            taskNameStyle.style.textDecoration = "line-through"
        }
    });
}
    //diplay all tasks on the screen
    axios.get(`${API}`).then(res=>showAllTasks(res.data.data.tasks))
    .catch( error => console.log(error))
    //toggel form and pluse icon
    const form = document.getElementById("tasksForm");
    const newTaskInputs = document.getElementById("tasksForm");
    const pluseBtn = document.querySelector("#pluse")
    pluseBtn.addEventListener("click",(e)=>{
        
        e.target.classList.toggle("negative");
        if(e.target.classList.contains("negative")){
            newTaskInputs.style.display = "flex";
        }else{
            newTaskInputs.style.display = "none";
        }
    })
    //new task
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        const endTimeError = document.querySelector(".endTimeError")
        const formData = new FormData(e.target);
        console.log(formData);
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
        console.log(formDataObj.endTime);
        if(formDataObj.startTime===""){
            endTimeError.textContent = "Please Provide Start Time"
        }
        if(formDataObj.endTime===""){
            endTimeError.textContent = "Please Provide End Time"
        }
        //create task 
        const date = new Date();
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000 ); 
        e.target.children[0].children[2].value = localDate.toISOString().substring(0, 16);
        axios.post(`${API}`,formDataObj)
        .then(res=>showAllTasks([res.data.task]))
        .catch(error=>console.log(error))
        // //add new task
        // axios.get(`${API}`).then(res=>{
        //     const singleTaskArr = [res.data.data.tasks[res.data.data.tasks.length-1]]
        //     showAllTasks(singleTaskArr)})
        // .catch( error => console.log(error))
        }
    )
    //check for daylight saving time (DST)
    function hasDST(date = new Date()) {
        const january = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
        const july = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
        return Math.max(january, july) !== date.getTimezoneOffset();
      }
      



