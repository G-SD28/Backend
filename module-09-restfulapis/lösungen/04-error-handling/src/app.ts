import express from 'express';
import '#db';
import { userRouter, postRouter } from '#routers';
import { errorHandler } from '#middleware';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postRouter);

// Temporäre test route
app.get('/error-test', (_req, _res, next) => {
  next(Object.assign(new Error('Something went wrong'), { status: 418 }));
});

app.use(errorHandler);

app.listen(port, () => console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`));
