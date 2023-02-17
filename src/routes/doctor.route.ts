import express from 'express';
import Doctor_Register_POST from '../controllers/doctor/register';
import Professional_PUT from '../controllers/doctor/professional';
import Doctor_Appointment_PUT from '../controllers/doctor/appointment_update';
import auth from '../middlewares/auth.middleware';
import controller from '../controllers/doctor/prescription.controller';
import profileUpdate from '../controllers/doctor/profileUpdate';
import sickNote from '../controllers/doctor/sickNote';
import spaciality from '../controllers/doctor/spaciality';
import qualification from '../controllers/doctor/qualification';
import multer from 'multer';
import userRole from '../middlewares/userRole.middleware';
import { Roles } from '../lib/roles';
import { validateBody, validateParams, validateQuery } from '../middlewares/joi.middleware';
import { deleteAvailability, listAvailability, updateAvailability } from '../controllers/doctor/availability.controller';
import { listAvailabilitySchema, updateAvailabilitySchema } from '../validator/availability.validation';
import { pathParamIdSchema } from '../validator/util';
const storage = multer.memoryStorage();
const upload = multer({ storage });
const doctorRouter = express.Router()

doctorRouter.post(
    "/register",
    upload.any(),
    Doctor_Register_POST
);
doctorRouter.put(
    "/profession_info",
    auth,
    Professional_PUT
);
doctorRouter.put(
    "/appointment",
    auth,
    Doctor_Appointment_PUT
);
doctorRouter.post(
    "/prescription/add",
    auth,
    controller.Prescription_POST
);
doctorRouter.put(
    "/prescription/update",
    auth,
    controller.Prescription_PUT
);

doctorRouter.put(
    "/profile/update",
    auth,
    profileUpdate
);

doctorRouter.put(
    "/availability",
    auth,
    userRole(Roles.DOCTOR),
    validateBody(updateAvailabilitySchema),
    updateAvailability
);

doctorRouter.get(
    "/availability",
    auth,
    userRole(Roles.DOCTOR),
    validateQuery(listAvailabilitySchema),
    listAvailability
);

doctorRouter.get(
    "/availability/:id",
    auth,
    userRole(Roles.DOCTOR),
    validateParams(pathParamIdSchema),
    listAvailability
);

doctorRouter.delete(
    "/availability/:id",
    auth,
    userRole(Roles.DOCTOR),
    validateParams(pathParamIdSchema),
    deleteAvailability
);
doctorRouter.post(
    "/sickNote",
    auth,
    userRole(Roles.DOCTOR),
    sickNote
);
doctorRouter.get(
    "/qualification",
    auth,
    userRole(Roles.DOCTOR),
    qualification
);
doctorRouter.get(
    "/spaciality",
    auth,
    userRole(Roles.DOCTOR),
    spaciality
);
export default doctorRouter
