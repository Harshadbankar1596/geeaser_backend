import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema({
    image : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        requerd : true,
        unique : true
    }
})

export default mongoose.model("Category" , CategorySchema)