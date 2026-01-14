import express from 'express';
import { sumPerDayInYearAndMonth, sumPerMonthInYear } from '../controllers/reportController.js';

const reportRouter = express.Router();

reportRouter.post("/sumPerDayInYearAndMonth", sumPerDayInYearAndMonth)
reportRouter.post("/sumPerMonthInYear", sumPerMonthInYear)

export default reportRouter;