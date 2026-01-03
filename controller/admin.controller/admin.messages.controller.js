import messagesModel from "../../models/messages.model.js";

const admin_Messages_Controller = {
  async getMessages(req, res) {
    try {
        const admin = req.admin;
        if(!admin){
            return res.status(401).json({message : "Admin is not valid"});
        }
        const messagesLele = await messagesModel.find();
        return res.status(200).json({message : "Success", data : messagesLele});
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default admin_Messages_Controller;
