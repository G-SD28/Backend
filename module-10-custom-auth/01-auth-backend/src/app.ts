import express from 'express';
import '#db';
import cookieParser from 'cookie-parser';
import { PORT } from '#config';
import { userRouter, postRouter, authRouter } from '#routers';
import { logger, errorHandler } from '#middlewares';

const app = express();

// Application-level middlewares
app.use(express.json());
app.use(logger);
app.use(cookieParser());
// app.use(express.static("public"));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.all('/*splat', async (req, res) => {
  throw new Error('Page not found', { cause: 404 });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
