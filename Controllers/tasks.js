const asyncWrapper = require("../middleware.js/async");
const Task = require("../models/Task");

const getAllTasks = asyncWrapper( async(req,res)=>{
        const tasks = await Task.find({});
        res.status(200).json({status:"success",data:{tasks,nHits: tasks.length}});

})
const getTask = asyncWrapper( async(req,res)=>{
    
        const{ id: taskID} = req.params;
        const task = await Task.findOne({_id: taskID});
        res.status(200).json({status:"success",data:task})
        if(!task){
            res.status(404).json({msg:`No Task with the id ${req.params.id}`})
        }
        
})
const createTask = asyncWrapper( async(req,res)=>{
        const task = await Task.create(req.body);
        res.status(201).json({task});
})

const deleteTask = asyncWrapper( async(req,res)=>{
        const{ id: taskID} = req.params;
        const task = await Task.findOneAndDelete({_id: taskID});
        if(!task){
            return res.status(404).json({msg: `No Task with the id ${taskID}`})
        }
        res.status(200).json({task})
})

const updateTask = asyncWrapper( async(req,res)=>{
    const{ id: taskID} = req.params;
        const task = await Task.findOneAndUpdate({_id:taskID},req.body,{
            new:true,
            runValidators:true
        })

        res.status(200).json({status:"success",data:task})

        if(!task){
            res.status(404).json({msg:`No task with this id ${taskID}`})
        }
})

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
}