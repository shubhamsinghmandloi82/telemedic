/* eslint-disable prefer-const */
/* eslint-disable no-useless-escape */
// import jwt from "jsonwebtoken";
import StatusCodes from "http-status-codes";
import User from '../../db/models/user';
const List_User = async (req, res) => {
    try {
        if (req.user.role_id == 'admin') {
            let { page, limit, sort, cond } = req.body;
            if (!page || page < 1) {
                page = 1;
            }
            if (!limit) {
                limit = 10;
            }
            if (!cond) {
                cond = {}
            }
            if (!sort) {
                sort = { "createdAt": -1 }
            }
            if (typeof (cond.search) == 'undefined' || cond.search == null) {
                cond.search = "";
            } else {
                cond.search = String(cond.search)
            }
            // if (typeof (cond.role_id) != 'undefined' && cond.role_id != null) {
            //     cond = [
            //         { $addFields: { phonestr: { $toString: '$phone' } } },
            //         {
            //             $match: {
            //                 $and: [{ "role_id": cond.role_id }, {
            //                     $or: [
            //                         { "email": { $regex: cond.search } },
            //                         { "firstname": { $regex: cond.search } },
            //                         { "lastname": { $regex: cond.search } },
            //                         { "phonestr": { $regex: cond.search } },
            //                     ]
            //                 }]
            //             }
            //         },
            //         { $project: { "phonestr": 0 } },
            //         { $sort: sort },
            //         {
            //             $facet: {
            //                 data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            //                 total: [
            //                     {
            //                         $count: 'count'
            //                     }
            //                 ]
            //             }
            //         }
            //     ]
            // } else {
            //     cond = [
            //         { $addFields: { phonestr: { $toString: '$phone' } } },
            //         {
            //             $match: {
            //                 $or: [
            //                     { "email": { $regex: cond.search } },
            //                     { "firstname": { $regex: cond.search } },
            //                     { "lastname": { $regex: cond.search } },
            //                     { "phonestr": { $regex: cond.search } },
            //                 ]
            //             }
            //         },
            //         { $project: { "phonestr": 0 } },
            //         { $sort: sort },
            //         {
            //             $facet: {
            //                 data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            //                 total: [
            //                     {
            //                         $count: 'count'
            //                     }
            //                 ]
            //             }
            //         }
            //     ]
            // }
            if (typeof (cond.role_id) != 'undefined' && cond.role_id != null) {
                cond = [
                    {
                        $match: {
                            $and: [{ "role_id": cond.role_id }, {
                                $or: [
                                    { "email": { $regex: cond.search } },
                                    { "firstname": { $regex: cond.search } },
                                    { "lastname": { $regex: cond.search } },
                                ]
                            }]
                        }
                    },
                    { $sort: sort },
                    {
                        $facet: {
                            data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                            total: [
                                {
                                    $count: 'count'
                                }
                            ]
                        }
                    }
                ]
            } else {
                cond = [
                    {
                        $match: {
                            $or: [
                                { "email": { $regex: cond.search } },
                                { "firstname": { $regex: cond.search } },
                                { "lastname": { $regex: cond.search } },
                            ]
                        }
                    },
                    { $sort: sort },
                    {
                        $facet: {
                            data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
                            total: [
                                {
                                    $count: 'count'
                                }
                            ]
                        }
                    }
                ]
            }
            limit = parseInt(limit);
            let user = await User.aggregate(cond)
            user = JSON.parse(JSON.stringify(user));

            // user.forEach(oneUser => oneUser.populate('paymentMethods'))
            let totalPages = 0;
            if(user[0].total.length != 0){
                totalPages = Math.ceil(user[0].total[0].count / limit);
            }
            res.status(StatusCodes.OK).send({
                status: true,
                type: 'success',
                message: "User List Fetch Successfully",
                page: page,
                limit: limit,
                totalPages: totalPages,
                total: user[0].total.length != 0 ? user[0].total[0].count : 0,
                data: user[0].data,
            });
        } else {
            res.status(400).send({
                status: false,
                type: 'error',
                message: "You Are Not Authorized User"
            });
        }


    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            type: 'error',
            message: error.message
        });
    }
}
export default List_User