import express from 'express';
import Login from '../controllers/user/login.controller';
import Passwordcontroller from '../controllers/user/Password.controller';
import List_POST from '../controllers/user/list';
import Prescription_List_POST from '../controllers/user/prescription_list';
import patientRouter from './patient.route';
import doctorRouter from './doctor.route';
import auth from '../middlewares/auth.middleware';
import notificationRouter from './notification.route';
import transactionRouter from './transaction.route';
import userRole from '../middlewares/userRole.middleware';
import { Roles } from '../lib/roles';
import { updateAdmin } from '../controllers/siteAdmin/update.controller';
import { validateBody, validateQuery } from '../middlewares/joi.middleware';
import { adminUpdateSchema } from '../validator/admin.validation';
import { deletePaymentMethod, getPaymentMethod, savePaymentMethod } from '../controllers/patient/paymentMethod.controller';
import { paymentMethod } from '../validator/paymentMethods.validation';
import { paginationQuerySchema } from '../validator/util';
import admin from '../routes/admin'
import List_User from '../controllers/user/list';
import corporateRoute from './corporate.route';

const router = express.Router()
router.use('/patient', patientRouter);
router.use('/doctor', doctorRouter);
router.post("/login", Login.login);
router.post("/admin/login", Login.admin);
router.use("/admin",admin);
router.put("/admin", auth, userRole(Roles.ADMIN), validateBody(adminUpdateSchema), updateAdmin);
router.post("/forgotPass", Passwordcontroller.forgotPassword)
router.post("/password-reset/:userId/:token", Passwordcontroller.resetPassword)
router.post("/password-change", auth, Passwordcontroller.changePassword)
router.post('/list', auth, List_User);
router.post('/prescription/list', auth, Prescription_List_POST);
router.use('/notifications', auth, notificationRouter)
router.use('/transactions', auth, transactionRouter)
router.use('/corporate',auth,userRole(Roles.CORPORATE),corporateRoute)

router.post(
    '/paymentMethods',
    auth,
    validateBody(paymentMethod),
    savePaymentMethod
);

router.get(
    '/paymentMethods',
    auth,
    validateQuery(paginationQuerySchema),
    getPaymentMethod
);

router.delete(
    '/paymentMethods/:id',
    auth,
    deletePaymentMethod
);

export default router