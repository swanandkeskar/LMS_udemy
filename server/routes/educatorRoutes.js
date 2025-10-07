import express from 'express'
import { updateRollEducator } from '../controllers/educatorController.js'

const educatorRuter=express.Router()

//add educator role

educatorRuter.get('/update-role',updateRollEducator)

export default educatorRuter;