import mongoose  from "mongoose";

const messagesSchema = new mongoose.Schema({
name : {
    type : String, 
    required : true
},
email : {
    type : String, 
    // required : true
},
contact : {
    type : String, 
    // required : true
},
message : {
    type : String, 
    required : true
}
},{timestamps : true});

export default mongoose.model("Messages", messagesSchema);