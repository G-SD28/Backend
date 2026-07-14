import { Router } from 'express';
import { register, login, logout } from '#controllers';
import { userInputSchema } from '#schemas';
import { validateBody } from '#middlewares';

const authRouter = Router();

authRouter.post('/register', validateBody(userInputSchema), register);
authRouter.post('/login', login);
authRouter.delete('/logout', logout);

export default authRouter;
