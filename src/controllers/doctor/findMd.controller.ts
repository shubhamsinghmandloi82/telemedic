import { StatusCodes } from 'http-status-codes';
import User from '../../db/models/user';
import { filterPaginate } from '../../lib/filterPaginate';
import { Roles } from '../../lib/roles';

export const findMd = async (req, res) => {
    try {
        const { f = {} } = req.query;
        const filterLocation = f.location ?? req.user.location;

        delete f.location;
        const filter = {
            userId: req.user._id,
            role_id: Roles.DOCTOR,
            ...f,
            ["license.location"]: {
                $regex: new RegExp(filterLocation, "i")
            },
        };

        const {
            docs: doctors,
            total,
            totalPages,
            page,
            limit
        } = await filterPaginate(User, filter, req.query);

        return res.status(StatusCodes.OK).json({
            type: "success",
            status: true,
            message: 'MD list',
            doctors,
            total,
            page,
            limit,
            totalPages,
        });
    } catch (error) {
        console.log({ error });
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            type: "error",
            status: false,
            message: error.message,
        });
    }
}