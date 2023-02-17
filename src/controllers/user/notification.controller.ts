import { StatusCodes } from 'http-status-codes';
import Notification from '../../db/models/notification.model';
import { filterPaginate } from '../../lib/filterPaginate';

export const listNotifications = async (req, res) => {
    try {
        const { f = {} } = req.query;
        const filter = {
            userId: req.user._id,
            ...f,
        };

        const {
            docs: notifications,
            total,
            totalPages,
            page,
            limit,
        } = await filterPaginate(Notification, filter, req.query);

        res.status(200).json({
            type: 'success',
            message: 'Notifications list',
            notifications,
            total,
            page,
            limit,
            totalPages,
        });
    } catch (error) {
        console.log({ error });
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            type: 'error',
            message: error.message,
        });
    }
};
