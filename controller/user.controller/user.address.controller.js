import AddressModel from "../../models/address.model.js";

const user_Address_Controller = {
  async AddAddress(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "User is not valid " });
      }
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const addressAdded = new AddressModel({
        user_id: user._id,
        address,
      });
      await addressAdded.save();
      return res.status(201).json({ message: "Address Added", addressAdded });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async DeleteAddress(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "User is not valid" });
      }
      const { address_id } = req.params;
      if (!address_id) {
        return res.status(400).json({ message: "Address id is required" });
      }
      const isAddressExists = await AddressModel.findOneAndDelete({
        user_id: user._id,
        _id: address_id,
      });
      if (!isAddressExists) {
        return res
          .status(400)
          .json({
            message: "Address does not exists or maybe wrong address chosen",
          });
      }
      return res.status(200).json({ message: "Address Deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async getMyAddress(req, res){
    try {
      const user = req.user;
      if(!user){
        return res.status(401).json({message : "User is not valid"});
      }
      const getAddress = await AddressModel.find({user_id : user._id});
      return res.status(200).json({message : "Success", data : getAddress});
    } catch (error) {
      return res.status(500).json({error : error.message});
    }
  }
};

export default user_Address_Controller;
