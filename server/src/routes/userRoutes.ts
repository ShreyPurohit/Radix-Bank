import Router from '@koa/router'
import {
    addToWalletController,
    alreadyLoggedController,
    fetchTransactionsController,
    getUserNameAndIDController,
    loginController,
    logoutController,
    sendMoneyController
} from '../controllers/userController'
import logger from 'koa-logger'

const router = new Router()

router.get('/alreadyloggeduser', alreadyLoggedController)
router.use(logger())
router.post('/login' ,loginController)
router.get('/logout', logoutController)
router.post('/sendMoney', sendMoneyController)
router.post('/addToWallet', addToWalletController)
router.get('/usernamelist', getUserNameAndIDController)
router.post('/myTransactions', fetchTransactionsController)

export default router