
import express, { application } from 'express';
import cors from 'cors'
import path from "path";
import methodOverride from "method-override";
import { config } from 'dotenv';
import getConnection from './db/connection'
config();
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(methodOverride("X-HTTP-Method-Override"));

//DATABASE CONNECTION
app.use(getConnection)
app.use("/public", express.static("./public"));
//View Engine
app.set('view engine', 'ejs')
//ROUTES
import userRoutes from './routes/userRoute'
import superAdminRoutes from './routes/superAdminRoute'
import siteAdminRoutes from './routes/siteAdminRoute'
import appointment from './routes/appointment'
import rating from './routes/rating'
import clinicalNote from './routes/clinicalNote'
import referral from './routes/referral'
import template from './routes/template'
import CountryStateCity from './routes/country_state_city';

app.use('/user', userRoutes);
// app.use('/admin/super', superAdminRoutes)
// app.use('/admin/site', siteAdminRoutes)
app.use('/appointments', appointment)
app.use('/rating', rating)
app.use('/clinicalNote', clinicalNote)
app.use('/referral', referral)
app.use('/template', template)
app.use('/get', CountryStateCity)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`)
})
