import { Router } from 'express';
import userRoutes from './user_routes.js';
import chatRoutes from './chats_routes.js';

const appRouter = Router();


appRouter.use('/user', userRoutes); //domain/api/v1/user
appRouter.use('/chats', chatRoutes); //domain/api/v1/chats



export default appRouter;
