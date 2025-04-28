require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Mess = require('../models/message');
const saltRounds = 10;

const determineRole = (email) => {
    if (email.includes('admin')) return 'admin';
    if (email.includes('lecture')) return 'lecture';
    return 'student';
};

const createUserService = async (
    name,
    email,
    password,
    LName,
    FName,
    CCCD,
    BDate
) => {
    const user = await User.findOneByEmail(email);
    if (user) {
        throw new Error('User existed');
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const role = determineRole(email);

    await User.create({
        name,
        email,
        password: hashPassword,
        role,
        LName,
        FName,
        CCCD,
        BDate,
    });
    return { message: 'User created successfully' };
};

const loginService = async (email, password) => {
    const user = await User.findOneByEmail(email);
    if (!user) {
        return { EC: 1, EM: 'email/password không hợp lệ' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { EC: 2, EM: 'email/password không hợp lệ' };
    }

    const payload = {
        email: user.email,
        name: user.name,
        role: user.role,
        CCCD: user.CCCD,
        id: user.id,
        SoLanPhat: user.SoLanPhat,
    };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    return {
        EC: 0,
        access_token,
        user: {
            email: user.email,
            name: user.name,
            role: user.role,
            CCCD: user.CCCD,
            id: user.id,
            SoLanPhat: user.SoLanPhat,
        },
    };
};

const getUsersService = async () => {
    return await User.findAll();
};

const getUserService = async (id) => {
    return await User.findOne(id);
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res
                .status(403)
                .json({ message: 'Cannot delete an admin user' });
        }

        await User.deleteById(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

const createMessService = async (name, email, mess) => {
    await Mess.create({ name, email, mess, role: 'duckphuong' });
    return { message: 'Message created' };
};

const getBlogService = async () => {
    return await Mess.findAll();
};

const getAllRoomsService = async () => {
    return await User.getAllRooms();
};

const getRoomService = async (roomID) => {
    return await User.getRoom(roomID);
};

const postBookingService = async (bookingData) => {
    return await User.postBooking(bookingData);
};

const getBookedSlotsService = async (roomID) => {
    return await User.getBookedSlots(roomID);
};

const getHistoryService = async (CCCD) => {
    return await User.getHistory(CCCD);
};

const getHistoryAllService = async () => {
    return await User.getHistoryAll();
};

const getViolateAllService = async () => {
    return await User.getViolateAll();
};

const postStatusService = async (ticketId, action, daytime) => {
    const validActions = ['CANCEL', 'PAID', 'LATE'];

    if (!validActions.includes(action)) {
        throw new Error('Hành động không hợp lệ');
    }
    console.log(ticketId, action);

    return await User.postStatusService(ticketId, action, daytime);
};

const updateUserService = async (id, data) => {
    return await User.updateUser(id, data);
};

const updateRoomService = async (id, data) => {
    return await User.updateRoom(id, data);
};

const getDurationService = async (startDate, endDate, roomID) => {
    return await User.getDuration(startDate, endDate, roomID);
};
module.exports = {
    createUserService,
    loginService,
    getUsersService,
    getUserService,
    deleteUser,
    createMessService,
    getBlogService,
    getAllRoomsService,
    getRoomService,
    postBookingService,
    getBookedSlotsService,
    getHistoryService,
    getHistoryAllService,
    getViolateAllService,
    postStatusService,
    updateUserService,
    getDurationService,
    updateRoomService,
};
