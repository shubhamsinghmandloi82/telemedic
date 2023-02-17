/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { differenceInMinutes, isBefore } from 'date-fns';
import { Request, Response, NextFunction } from 'express';
import { MIN_MEETING_DURATION } from '../../../constant';
import Appointment from '../../db/models/appointment.model';
import Availability from '../../db/models/availability.model';

interface Appointment {
  patientId: number;
  appointmentId: number;
  symptoms: Array<string>;
  createdAt: Date;
  doctorId: number;
  doctor: number;
  dateOfAppointment: Date;
  appointmentType: string;
}

//getting all Appointments
const getAppointments = async (req, res: Response, next: NextFunction) => {
  try {
    const user = JSON.parse(JSON.stringify(req.user));
    let { page, limit, sort, cond } = req.body;

    if (user.role_id === 'doctor') {
      cond = { ...cond, doctorId: user._id };
    }

    if (user.role_id === 'patient') {
      cond = { patientId: user._id, ...cond };
    }

    if (!page || page < 1) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    if (!cond) {
      cond = {};
    }
    if (!sort) {
      sort = { createdAt: -1 };
    }

    limit = parseInt(limit);
    // console.log(cond);
    const result = await Appointment.find(cond)
      .populate('patient_details')
      .populate('doctor_details')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    const result_count = await Appointment.find(cond).count();
    const totalPages = Math.ceil(result_count / limit);
    return res.status(200).json({
      status: true,
      type: 'success',
      message: 'Appointment Fetch Successfully',
      page: page,
      limit: limit,
      totalPages: totalPages,
      total: result_count,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// Get Appointment By ID
const getAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Appointmentid } = req.params;

    const result = await Appointment.findById(Appointmentid)
      .populate('patient_details')
      .populate('doctor_details');

    return res.status(200).json({
      status: true,
      type: 'success',
      message: 'Appointment List Fetched',
      data: result,
    });
  } catch (Err) {
    // console.log(Err);
    res.status(404).json({
      statue: false,
      type: 'error',
      message: 'Appointment not found',
    });
  }
};

// Update an Appointment By ID
const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Appointmentid } = req.params;
    const { isEmergency, dateOfAppointment } = req.body;

    const doc = await Appointment.findById(Appointmentid);

    const update = {
      isEmergency: isEmergency,
      dateOfAppointment: dateOfAppointment,
    };
    await doc.updateOne(update);

    const updateDoc = await Appointment.findById(Appointmentid);

    return res.status(200).json({
      status: true,
      type: 'success',
      message: 'Appointment Updated Sucessfully',
      data: updateDoc,
    });
  } catch (Err) {
    // console.log(Err);
    res.status(404).json({
      type: 'error',
      status: false,
      message: 'Appointment not found',
    });
  }
};

// Delete Appointment ById
const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Appointmentid } = req.params;

    const result = await Appointment.deleteOne({ _id: Appointmentid });

    return res.status(200).json({
      status: true,
      type: 'success',
      message: 'Appointment Delete Successful',
    });
  } catch (Err) {
    // console.log(Err);
    res.status(404).json({
      success: false,
      message: 'Appointment not found',
    });
  }
};

// Function to Create an Appointment
const addAppointment = async (req, res: Response, next: NextFunction) => {
  // Get the data from query body
  const {
    doctorId,
    appointmentType,
    dateOfAppointment,
    symptoms,
  }: Appointment = req.body;

  const user = JSON.parse(JSON.stringify(req.user));
  if (user.role_id != 'patient') {
    return res.status(404).json({
      status: false,
      type: 'success',
      message: 'You are not authorise to create an Appointment',
    });
  }

  try {

    if (isBefore(new Date(dateOfAppointment), new Date())) {
      return res.status(404).json({
        status: false,
        type: 'success',
        message: 'You can not create an Appointment in the past',
      });
    }

    const doctorAvailability = await Availability.findOne({
      doctorId: doctorId,
      start: {
        $lte: dateOfAppointment,
      },
      end: {
        $gte: dateOfAppointment,
      },
      $or: [
        {
          break_start: undefined
        },
        {
          break_start: {
            $gt: dateOfAppointment,
          },
        },
        {
          break_end: {
            $lt: dateOfAppointment,
          },
        },
      ],
    });

    if (!doctorAvailability) {
      return res.status(404).json({
        status: false,
        type: 'success',
        message: 'Doctor is not available on this date/time',
      });
    }

    if (
      differenceInMinutes(doctorAvailability.end, new Date(dateOfAppointment)) <
      MIN_MEETING_DURATION
    ) {
      return res.status(404).json({
        status: false,
        type: 'success',
        message: 'Doctor is not available on this date/time',
      });
    }

    const newAppointment = new Appointment({
      patientId: user._id,
      symptoms,
      doctorId,
      appointmentType,
      dateOfAppointment,
    });
    await newAppointment.save();

    res.status(201).json({
      status: true,
      type: 'success',
      data: newAppointment,
    });
  } catch (Err) {
    // console.log(Err);
    res.status(404).json({
      status: false,
      message: 'One Or More Required Field is empty',
    });
  }
};

export default {
  getAppointments,
  addAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
