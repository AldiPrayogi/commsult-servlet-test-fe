import axios from 'axios';

const API_URL = 'http://localhost:8080/CommsultTest/InsertData/';

const getAllUser = async () => axios.get(API_URL, {validateStatus: () => true});

const userService = {
    getAllUser, API_URL
};

export default userService;