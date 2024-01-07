const express = require('express')
const { protect } = require('../middlewares/authMiddleware')
const router = express.Router()
const {accessChats,fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require('../controllers/chatControlers')

router.route('/').all(protect).post(accessChats).get(fetchChats)
router.route('/group').all(protect).post(createGroupChat)
router.route('/group/rename').all(protect).put(renameGroup)
router.route('/group/add').all(protect).put(addToGroup)
router.route('/group/remove').all(protect).put(removeFromGroup)

module.exports = router