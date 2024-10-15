const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        email:{
            type : String,
            required :[true,'arjunchauhan2755@gmail.com'],
            unique:true,
            lowercase:true,
            match:[
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'arjunchauhan2755@gmail.com',
            ],
        },
        password:{
            type: String,
            required: [true, 'arjun123'],
            minlength: 6,
            select: false,
        },
        role:{
            type: String,
            enum: ['ADMIN', 'USER'],
            default: 'USER',
        },
    },
    {timestamps:true}
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);