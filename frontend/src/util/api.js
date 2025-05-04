import axios from './axios.customize';

const createUserApi = async (
    name,
    email,
    password,
    LName,
    FName,
    CCCD,
    BDate
) => {
    const URL_API = '/v1/api/register';
    const data = { name, email, password, LName, FName, CCCD, BDate };

    try {
        return await axios.post(URL_API, data);
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

function loginApi(email, password) {
    const URL_API = '/v1/api/login';
    const data = {
        email,
        password,
    };
    return axios.post(URL_API, data);
}

function getUsersApi() {
    const URL_API = '/v1/api/user';
    return axios.get(URL_API);
}

function getUserApi(id) {
    const URL_API = `/v1/api/profile/${id}`;
    return axios.get(URL_API);
}

const postWritePage = async (email, name, mess) => {
    const URL_API = '/v1/api/write';
    const data = {
        email,
        name,
        mess,
    };
    return await axios.post(URL_API, data);
};

const getBlogApi = async () => {
    const URL_API = 'v1/api/blog';
    return await axios.get(URL_API);
};

function getAllRoomsApi1() {
    const URL_API = '/v1/api/roomall';
    return axios.get(URL_API);
}

function getAllRoomsApi() {
    const URL_API = '/v1/api/rooms';
    return axios.get(URL_API);
}

function getRoomApi(roomID) {
    const URL_API = `/v1/api/rooms/${roomID}`;
    return axios.get(URL_API);
}

const postBookingApi = async (RoomID, bookingData) => {
    const URL_API = `/v1/api/booking/${RoomID}`;
    console.log('Room ID:', RoomID);
    console.log('Booking Data:', bookingData);
    try {
        return await axios.post(URL_API, bookingData);
    } catch (error) {
        console.error('API Error:', error);
        throw error.response?.data?.error || 'Đặt phòng thất bại.';
    }
};

function getHistoryApi(CCCD) {
    const URL_API = `/v1/api/history`;
    return axios.get(URL_API, { CCCD });
}

function getHistoryAllApi() {
    const URL_API = `/v1/api/historyall`;
    return axios.get(URL_API);
}

function getViolateApi() {
    const URL_API = `/v1/api/violate`;
    return axios.get(URL_API);
}

function cancelTicketApi(ticketId) {
    const URL_API = `/v1/api/history/${ticketId}`;
    return axios.post(URL_API, {
        action: 'CANCEL',
    });
}

function returnTicketApi(ticketId, action) {
    try {
        const response = axios.post(`/v1/api/history/${ticketId}`, {
            action,
        });
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export {
    createUserApi,
    loginApi,
    getUserApi,
    getUsersApi,
    postWritePage,
    getBlogApi,
    getAllRoomsApi,
    getAllRoomsApi1,
    getRoomApi,
    postBookingApi,
    getHistoryApi,
    getHistoryAllApi,
    getViolateApi,
    cancelTicketApi,
    returnTicketApi,
};
