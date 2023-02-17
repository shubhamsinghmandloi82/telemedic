import { StatusCodes } from "http-status-codes";
import User from "../../db/models/user";
import { Roles } from "../../lib/roles";
import S3 from '../../services/upload';
import activityLog from "../../services/activityLog";
import { ACTIVITY_LOG_TYPES } from "../../../constant";
import clinicalNote from "../../db/models/clinicalNote.model";


export const doctorApprove = async (req, res) => {
    try {   
        if (req.user.role_id != 'admin') {
           return res.status(400).json({
              status: false,
              type: "Error",
              message: "You Are Not Authorized User "
            })
          } 
        let userData = await User.findOne({_id:req.body.id});
        let response = await User.findByIdAndUpdate(req.body.id, {  $set:{
            status : "enable",
            isAvailability : true
        } });
        let tempArray = {}
        tempArray['oldData'] = userData
        tempArray['newData'] = {status : "enable",
        isAvailability : true}
        let activityData = await activityLog.create(req.user._id, req.user.role_id, ACTIVITY_LOG_TYPES.UPDATED, req, tempArray)
       
        return res.status(StatusCodes.OK).json({
            type: "success",
            status: true,
            message: "Admin Updated",
        });
    } catch (Err) {
        console.log(Err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: false,
            message: 'Admin not found',
        });
    }
};
