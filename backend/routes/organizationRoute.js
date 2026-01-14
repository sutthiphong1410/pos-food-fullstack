import express from 'express';

import { create, info, uploadLogo } from '../controllers/organizationController.js';

const organizationRouter = express.Router();

organizationRouter.post('/create', create);
organizationRouter.get('/info', info);
organizationRouter.post('/upload-logo', uploadLogo);


export default organizationRouter;