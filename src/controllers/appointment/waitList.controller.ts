import { StatusCodes } from 'http-status-codes';
import { isAfter, differenceInMinutes } from 'date-fns';
import Appointment from '../../db/models/appointment.model';
import { AppointmentStatuses } from '../../lib/appointmentStatuses';
import { getSlotIndex, getSlots } from '../../lib/utils/timeSlots';

export const waitList = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            patientId: req.user._id,
            _id: req.query.appointmentId,
        });

        if (!appointment) {
            return res.status(StatusCodes.NOT_FOUND).json({
                type: 'error',
                status: false,
                message: 'Appointment not found',
            });
        }

        if (appointment.status !== AppointmentStatuses.PENDING) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                type: 'error',
                status: false,
                message: 'Appointment is not pending',
            });
        }

        if (isAfter(new Date(), appointment.dateOfAppointment)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                type: 'error',
                status: false,
                message: 'Appointment date is in the past',
            });
        }

        appointment.dateOfAppointment.setSeconds(0, 0);

        const start = new Date(appointment.dateOfAppointment.getTime());
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(appointment.dateOfAppointment.getTime());
        end.setUTCHours(23, 59, 59, 999);
        const slots = getSlots(start, end, 30);

        const appointments = await Appointment.find({
            doctorId: appointment.doctorId,
            dateOfAppointment: {
                $gte: start,
                $lt: appointment.dateOfAppointment,
            },
        }).sort({ dateOfAppointment: 1 });

        // filter out completed appointments
        const filteredAppointments = appointments.filter(
            (appointment) => appointment.status !== AppointmentStatuses.COMPLETED
        );

        // find in progress appointment
        const inProgressAppointment = filteredAppointments.find(
            (appointment) => appointment.status === AppointmentStatuses.IN_PROGRESS
        );

        const slotIndexOfInProgressAppointment = getSlotIndex(
            slots,
            inProgressAppointment?.dateOfAppointment
        );

        const slotIndexOfAppointment = getSlotIndex(
            slots,
            appointment.dateOfAppointment
        );

        // calculate estimated wait time
        const estimatedWaitTime = inProgressAppointment
            ? filteredAppointments.length * 30
            : differenceInMinutes(appointment.dateOfAppointment, new Date());

        return res.status(StatusCodes.OK).json({
            type: 'success',
            status: true,
            message: 'Appointment found',
            data: { appointment },
            est: estimatedWaitTime,
            inProgressAppointment: inProgressAppointment
                ? slotIndexOfInProgressAppointment
                : null,
            appointment: slotIndexOfAppointment,
        });
    } catch (error) {
        console.log({ error });
        return res.status(400).json({
            type: 'error',
            status: false,
            message: error.message,
        });
    }
};
