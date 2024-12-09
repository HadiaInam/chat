import express from 'express';
import {signup, signin, getUserIdFromToken, getAllUsers, addChats, getUserChats, updateUser, userInfo } from '../controllers/user.controller.js';
import authUser from '../utils/auth.js';
import upload from '../utils/multer.js';

const router = express.Router();
router.post('/signup', signup)
router.post('/signin', signin)
router.post('/token-userid', getUserIdFromToken)
router.post('/all-users', getAllUsers)
router.post('/add-chat', addChats)
router.post('/get-chats', getUserChats)
router.post('/update', authUser, upload.fields([{name: 'profilePicture', maxCount:1}]), updateUser)
router.post('/get-user', authUser, userInfo)

export default router