const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    //vildation
    name:{
        type: String,
        required: [true, "You must provide name"],
        trim: true,
        maxlength: [20,'name can not be more than 20 characters']
    },
    discreption:{
        type:String,
        trim:true
    },
    startTime:{
        type:Date,
        require: [true,"You must provide start time"],
        default: Date.now()
    },
    endTime:{
        type:Date,
        require: [true,"You must provide start time"],
        default: Date.now()+60*60*60*1000*24
    },
    completed:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model("Task",taskSchema);