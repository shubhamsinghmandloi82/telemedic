import express from "express";
// import controller from "../controllers/country-state-city/insert";
import getCountry from "../controllers/country-state-city/getCountry";
import GetCountryCode from  '../controllers/country-state-city/getCountryCode'
import GetState from  '../controllers/country-state-city/getState'
const router = express.Router();

// router.get("/", controller);
router.get("/countryName",getCountry);
router.get("/dial-code", GetCountryCode);
router.get("/states", GetState);
export = router;
