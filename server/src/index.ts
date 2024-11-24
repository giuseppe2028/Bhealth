import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';


dotenv.config();
const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});
//TODO to protect
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to my TypeScript server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
