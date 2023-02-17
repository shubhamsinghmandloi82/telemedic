import { StatusCodes } from 'http-status-codes';
import { ACTIVITY_LOG_TYPES } from '../../../constant';
import User from '../../db/models/user';
import { Roles } from '../../lib/roles';
import activityLog from '../../services/activityLog';

const healthData = async (req, res) => {
    try {
        const tempArray = {};
        tempArray['oldData'] = await User.findById(req.user._id);
        const user = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                role_id: Roles.PATIENT,
            },
            { ...req.body },
            { new: true }
        );

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                type: 'error',
                status: false,
                message: 'User not found',
            });
        }

        tempArray['newData'] = user;
        await activityLog.create(
            user?._id,
            user?.role_id,
            ACTIVITY_LOG_TYPES.UPDATED,
            req,
            tempArray
        );
        return res.status(StatusCodes.OK).json({
            type: 'success',
            status: true,
            message: 'Health data updated',
            data: { user },
        });
    } catch (error) {
        // mongoose email exists error
        if (error.code === 11000) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                type: 'error',
                status: false,
                message: 'User already exists',
            });
        }
        console.log({ error });
        return res.status(400).json({
            type: 'error',
            status: false,
            message: error.message,
        });
    }
};
export default healthData;
