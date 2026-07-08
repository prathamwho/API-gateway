const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();

const PORT = process.env.PORT || 3005;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001/';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://localhost:3002/';
const FLIGHT_SERVICE_URL = process.env.FLIGHT_SERVICE_URL || 'http://localhost:3000/';
const REMINDER_SERVICE_URL = process.env.REMINDER_SERVICE_URL || 'http://localhost:3003/';

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, 
	limit: 300
})
app.use(morgan('combined'));
app.use(limiter);

const proxyOptions = (target, pathPrefix, servicePrefix = '/api/v1') => ({
    target,
    changeOrigin: true,
    pathRewrite: {
        [`^${pathPrefix}`]: servicePrefix
    }
});

app.use('/api/auth', createProxyMiddleware(proxyOptions(AUTH_SERVICE_URL, '/api/auth')));
app.use('/api/airports', createProxyMiddleware(proxyOptions(FLIGHT_SERVICE_URL, '/api/airports', '/api/v1/airports')));
app.use('/api/cities', createProxyMiddleware(proxyOptions(FLIGHT_SERVICE_URL, '/api/cities', '/api/v1/city')));
app.use('/api/flights', createProxyMiddleware(proxyOptions(FLIGHT_SERVICE_URL, '/api/flights', '/api/v1/flights')));
app.use('/api/bookings', createProxyMiddleware(proxyOptions(BOOKING_SERVICE_URL, '/api/bookings', '/api/v1/bookings')));
app.use('/api/reminders', createProxyMiddleware(proxyOptions(REMINDER_SERVICE_URL, '/api/reminders')));
app.use('/bookingservice', createProxyMiddleware({target: BOOKING_SERVICE_URL, changeOrigin: true}));

app.get('/home', (req, res)=>{
    return res.json({message: 'OK'});
});

app.listen(PORT, ()=>{
    console.log(`Server started at port ${PORT}`);
});

