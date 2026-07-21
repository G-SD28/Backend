import { Router } from 'express';
import { validateBodyZod } from '#middlewares';
import { promptBodySchema } from '#schemas';
import { createCompletion } from '#controllers';

const completionsRouter = Router();
completionsRouter.use(validateBodyZod(promptBodySchema));

completionsRouter.post('/chained-prompt', createCompletion);

export default completionsRouter;
