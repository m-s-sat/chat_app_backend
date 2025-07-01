const mongoose = require('mongoose');
const {Schema} = mongoose

const userSchema = new Schema({
    email:{type:String,requried:true},
    password:{type:Buffer,requried:true},
    salt:Buffer
},{timestamps:true});

const virtual = userSchema.virtual('id');
virtual.get(function(){
    return this._id;
});
userSchema.set('toJSON',{
    virtuals: true,
    versionKey: false,
    transform: function(doc,ret){
        delete ret._id;
    },
});

exports.User = mongoose.model('user',userSchema);