import express from 'express';
import { addImage, addMessage, getMessages } from '../controllers/message.controller.js';
import authUser from '../utils/auth.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.post('/add-message', authUser, addMessage)
router.post('/add-image', upload.fields([{name: 'message', maxCount:1}]), authUser, addImage)
router.post('/get-messages', getMessages)
export default router

