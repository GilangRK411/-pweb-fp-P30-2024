import express from 'express';
import cors from 'cors';
import ApiRouter from './api/api.router.js'; 
import UserAuth from './routers/user.auth.route.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', ApiRouter);  
app.use('/auth', UserAuth);  

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
