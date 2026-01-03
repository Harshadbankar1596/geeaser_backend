
import UsersModel from "../../models/user.model.js"

const admin_User_Controller = {
    async GetAllUsers (req, res){
        try {
            const admin = req.admin;
            if(!admin){
                return res.status(401).json({message : "Admin is not valid"});
            }
            const users = await UsersModel.find({});
            return res.status(200).json({message : "Users", data : users});

        } catch (error) {
            return res.status(500).json({error : error.message});
        }
    }
}


export default admin_User_Controller;