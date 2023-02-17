import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import User from "../../db/models/user";
import bcrypt from 'bcrypt'
import { Roles } from "../../lib/roles";

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        User.findOne({
            email: email
        })
            .exec((err, user) => {
                if (err) {
                    res.status(500).send({
                        type: "error",
                        status: false,
                        message: err
                    });
                    return;
                }
                if (!user) {
                    return res.status(404).send({
                        type: "error",
                        status: false,
                        message: "User Not Found"
                    })
                }
                if (user.role_id == 'doctor' && (!user.isApproved && user.isProfessionalInfo)) {
                    return res.status(400).send({
                        type: "error",
                        status: false,
                        message: "Pending verification, Approval & activation. Someone from our management team will contact you shortly"
                    })
                }
                const passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(404).send({
                        type: "error",
                        status: false,
                        message: "Invalid Password!"
                    });
                }

                const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: 86400  //24 hours
                });

                user.populate('paymentMethods', (err, user) => {
                    res.status(StatusCodes.OK).json({
                        type: "success",
                        status: true,
                        message: "User Successfully Logged-In",
                        data: {
                            ...user.toObject(),
                            token: token,
                        },
                    });
                })
            })


    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            type: "error",
            status: false,
            message: error.message
        })
    }
}

const admin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email: email,
            role_id: Roles.ADMIN
        })

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).send({
                type: "error",
                status: false,
                message: "User Not Found"
            })
        }

        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(StatusCodes.FORBIDDEN).send({
                type: "error",
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400  //24 hours
        });

        user.populate('paymentMethods', (err, user) => {
            res.status(StatusCodes.OK).json({
                type: "success",
                status: true,
                message: "Admin Successfully Logged-In",
                data: {
                    ...user.toObject(),
                    token: token,
                },
            });
        })
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            type: "error",
            status: false,
            message: error.message
        })
    }

}
export default { login, admin }