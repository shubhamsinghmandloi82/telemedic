import express from "express";
import controller from "../controllers/appointment/appointment.controller";
import { waitList } from "../controllers/appointment/waitList.controller";
import { Roles } from "../lib/roles";
import auth from "../middlewares/auth.middleware";
import { validateQuery } from "../middlewares/joi.middleware";
import userRole from "../middlewares/userRole.middleware";
import { waitListQuerySchema } from "../validator/waitList.validation";
const router = express.Router();


router.post("/", auth, controller.addAppointment);
router.post("/list",auth, controller.getAppointments);
router.get(
    '/waitlist',
    auth,
    userRole(Roles.PATIENT),
    validateQuery(waitListQuerySchema),
    waitList
);
router.get('/:Appointmentid', controller.getAppointment);
router.put('/:Appointmentid', controller.updateAppointment);
router.delete('/:Appointmentid', controller.deleteAppointment);
export = router;

// no need to pass userID
