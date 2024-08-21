import Router from '@koa/router'
import {
    addToWalletController,
    alreadyLoggedController,
    fetchTransactionsController,
    getUserNameAndIDController,
    loginController,
    logoutController,
    sendMoneyController
} from '../controllers/userContorller'

const router = new Router()

router.post('/login', loginController)
router.get('/logout', logoutController)
router.post('/sendMoney', sendMoneyController)
router.post('/addToWallet', addToWalletController)
router.get('/usernamelist', getUserNameAndIDController)
router.get('/alreadyloggeduser', alreadyLoggedController)
router.post('/myTransactions', fetchTransactionsController)

export default router