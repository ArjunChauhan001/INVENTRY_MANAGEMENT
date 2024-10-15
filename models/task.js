const mongoose = require('mongoose');

const taskschema  = new mongoose.Schema(
    {
        title:{
            type:String,
            required:[true,'inventry manegment'],
            trim:true,
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
          type: String,
          enum: ['To Do', 'In Progress', 'Completed'],
          default: 'To Do',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        dueDate: {
            type: Date,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project', // Assuming you have a Project model
            required: true,
        },
    },
    {timestamps:true}
)

module.exports = mongoose.model('Task', taskSchema);