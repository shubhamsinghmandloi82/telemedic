import express from 'express';
import { listNotifications } from '../controllers/user/notification.controller';
import { validateQuery } from '../middlewares/joi.middleware';
import { paginationQuerySchema } from '../validator/util';

const notificationRouter = express.Router();

notificationRouter.get(
    '/',
    validateQuery(paginationQuerySchema),
    listNotifications
);

export default notificationRouter;
