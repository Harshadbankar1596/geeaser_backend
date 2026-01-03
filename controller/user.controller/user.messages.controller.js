
import MessagesModel from "../../models/messages.model.js"

const user_Messages_Controller = {
  async postMessages(req, res) {
    try {
      const { name, email, contact, message } = req.body;
      if (!name || !message) {
        return res
          .status(400)
          .json({ message: "Name and message are required" });
      }
      const newMessage = new MessagesModel({
        name,
        email,
        contact,
        message
      })
      await newMessage.save();
      return res.status(201).json({message : "Thanks for contacting us."})
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default user_Messages_Controller;
