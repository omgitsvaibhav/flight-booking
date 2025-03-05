import express from 'express';
import authRoute from './auth';
import flightRoute from './flight'

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/flight',
        route: flightRoute
    },
];

defaultRoutes.forEach(route => {
    router.use(route.path, route.route);
});

export default router;