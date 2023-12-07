import express from 'express';
const router = express.Router();
import irnOutboxController from '../modules/irn/irnController';

router.get('/irn', irnOutboxController.getAll)
router.post('/irnUpdate', irnOutboxController.update)
router.get('/irnById/:id', irnOutboxController.getOne)
router.post('/irnCreate', irnOutboxController.create)
router.get('/irnDelete', irnOutboxController.delete)
export default router;