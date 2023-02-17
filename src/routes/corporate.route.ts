import express from 'express';
import controller from '../controllers/user/corporate.controller';


const corporateRoute = express.Router();

corporateRoute.post('/patient',controller.addPatient);
corporateRoute.post('/doctor',controller.addPhysician);


export default corporateRoute;
