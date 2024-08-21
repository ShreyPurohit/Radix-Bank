import Router from '@koa/router'
import { addToWalletController, alreadyLoggedController, getUserNameAndIDController, loginController, logoutController, sendMoneyController } from '../controllers/userContorller'
const router = new Router()

router.get('/alreadyloggeduser', alreadyLoggedController)
router.post('/login', loginController)
router.get('/logout', logoutController)
router.post('/addToWallet', addToWalletController)
router.get('/usernamelist', getUserNameAndIDController)
router.post('/sendMoney', sendMoneyController)

export default router