import { Router } from 'express';
import { validateBodyZod } from '#middlewares';
import { PromptBodySchema } from '#schemas';
import { createCompletion } from '#controllers';

const completionsRouter = Router();
completionsRouter.use(validateBodyZod(PromptBodySchema));

completionsRouter.post('/chained-prompt', createCompletion);

export default completionsRouter;
