const express = require('express');
const {
    createUser,
    handleLogin,
    getUsers,
    getUser,
    getAccount,
    handleDeleteUser,
    createMess,
    getBlog,
    getAllRooms,
    getRoom,
    getBookedSlots,
    getHistory,
    getHistoryAll,
    postCancel,
    updateUser,
    getViolateAll,
    getDuration,
} = require('../controllers/userController');
const delay = require('../middleware/delay');
const auth = require('../middleware/auth');
const { postBookingService } = require('../services/userService');

const routerAPI = express.Router();

// routerAPI.all('*', delay);

routerAPI.all('*', auth);

routerAPI.post('/register', createUser);

routerAPI.get('/account', getAccount);
//hien thi o cho welcome

routerAPI.post('/login', handleLogin);

routerAPI.get('/user', getUsers);
routerAPI.get('/profile/:id', getUser);

routerAPI.post('/write', createMess);
routerAPI.get('/blog', getBlog);

routerAPI.delete('/user/:id', handleDeleteUser);

routerAPI.post('/user/:id', updateUser);

routerAPI.get('/rooms', getAllRooms);
routerAPI.get('/roomall', getAllRooms);

routerAPI.get('/room/:roomID', () => console.log(12213));

routerAPI.post('/booking/:roomID', async (req, res) => {
    console.log('req', req.body);
    console.log('req.params', req.params);
    try {
        const bookingData = req.body;
        const data = await postBookingService(bookingData);
        return res.status(200).json({ status: 200, data });
    } catch (e) {
        console.error('Booking Error:', e);
        return res.status(400).json({ error: e.message });
    }
});

routerAPI.get('/booking/:roomID', getBookedSlots);

routerAPI.get('/history', getHistory);

routerAPI.get('/historyall', getHistoryAll);

routerAPI.get('/violate', getViolateAll);

routerAPI.post('/history/:TicketID', postCancel);

routerAPI.post('/booking-duration', getDuration);

module.exports = routerAPI; //export default
