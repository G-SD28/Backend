import { Router } from 'express';
import { createLMSCompletion, createOllamaCompletion } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { promptBodySchema } from '#schemas';

const completionsRouter = Router();
completionsRouter.use(validateBodyZod(promptBodySchema));

completionsRouter.post('/ollama', createOllamaCompletion);
completionsRouter.post('/lms', createLMSCompletion);

export default completionsRouter;
