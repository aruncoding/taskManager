import userRoutes from './module/User/routes/userRoutes.js';
import taskRoutes from './module/Task/routes/taskRoutes.js';

const registerRoutes = (app) => {
    app.use('/api/user', userRoutes);
    app.use('/api/task', taskRoutes);
  };
  
  export default registerRoutes;