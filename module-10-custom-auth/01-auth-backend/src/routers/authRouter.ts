import { Router } from 'express';
import { register, login, logout, me, refresh } from '#controllers';
import { userInputSchema } from '#schemas';
import { validateBody, authenticate } from '#middlewares';

const authRouter = Router();

authRouter.post('/register', validateBody(userInputSchema), register);
authRouter.post('/login', login);
authRouter.delete('/logout', logout);
authRouter.get('/me', authenticate, me);
authRouter.post('/refresh', refresh);

export default authRouter;
