import express from 'express';
import { sumPerDayInYearAndMonth, sumPerMonthInYear } from '../controllers/reportController.js';
import isAuthen from '../middlewares/authUser.js';

const reportRouter = express.Router();

reportRouter.post("/sumPerDayInYearAndMonth", sumPerDayInYearAndMonth)
reportRouter.post("/sumPerMonthInYear", isAuthen, sumPerMonthInYear)

export default reportRouter;