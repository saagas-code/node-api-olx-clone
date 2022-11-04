import { Router, Request } from 'express';
import * as UserController from '../controllers/UserController';
import * as AdController from '../controllers/AdController';
import * as AuthController from '../controllers/AuthController';
import * as ImageController from '../controllers/ImageController';
import { Auth } from './../middlewares/auth';
import {AuthValidator} from '../validators/AuthValidator'
import { UserValidator } from './../validators/UserValidator';
import { upload } from '../middlewares/uploadFile';



const router = Router();

router.get('/request', Auth.private, AuthController.AccountREQUEST);
router.post('/user/signin', AuthValidator.signin,  AuthController.signin);
router.post('/user/signup', AuthValidator.signup,  AuthController.signup);

router.get('/states', UserController.getStates);
router.get('/user/me', UserController.info);
router.post('/user/me', UserValidator.editAction, UserController.editAction);

router.get('/categories', AdController.getCategories);

router.post('/ad/add', upload.array('img'), AdController.addAction);
router.get('/ad/list', AdController.getList);
router.get('/ad/:id', AdController.getItem);
router.post('/ad/:id', upload.array('img'), AdController.editAction);
router.post('/ad', AdController.deleteAction);

router.post('/images', ImageController.getImages);
router.post('/images/delete', ImageController.deleteImage);


export default router;