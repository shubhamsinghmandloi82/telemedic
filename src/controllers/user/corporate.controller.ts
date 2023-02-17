/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { differenceInMinutes, isBefore } from 'date-fns';
import { Request, Response, NextFunction } from 'express';


//getting all Appointments
const addPatient = async (req, res: Response, next: NextFunction) => {
  try {
    
    return res.status(200).json({
      status: true,
      type: 'success',
      message: 'Appointment Fetch Successfully',
    //   page: page,
    //   limit: limit,
    //   totalPages: totalPages,
    //   total: result_count,
    //   data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

const addPhysician = async (req, res: Response, next: NextFunction) => {
    try {
      
      return res.status(200).json({
        status: true,
        type: 'success',
        message: 'Appointment Fetch Successfully',
      //   page: page,
      //   limit: limit,
      //   totalPages: totalPages,
      //   total: result_count,
      //   data: result,
      });
    } catch (error) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }
  };

export default {
    addPatient,
    addPhysician
};
