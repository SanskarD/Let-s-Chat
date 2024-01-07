const express = require('express')
const router = express.Router()

const {registerUser, authUser,allUsers} = require('../controllers/userControlers')
const { protect } = require('../middlewares/authMiddleware')

router.route('/').post(registerUser).get(protect,allUsers)
router.post('/login',authUser)

module.exports = router