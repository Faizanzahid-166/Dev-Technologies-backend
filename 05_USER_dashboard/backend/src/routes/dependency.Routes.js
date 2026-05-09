import express from 'express';
import {
    getDependencies,
    createDependency,
    updateDependency,
    deleteDependency,
    getDependency,
} from '../controllers/dependency/dependency.Controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { dependencyValidation, dependencyUpdateValidation } from '../utils/expressvalidators.js';

const router = express.Router();
router.use(protect); // All dependency routes require authentication

router.route('/')
  .get(getDependencies)
  .post(dependencyValidation, createDependency);

router.route('/:id')
  .get(getDependency)
  .put(dependencyUpdateValidation, updateDependency)
  .delete(deleteDependency);

  export default router;