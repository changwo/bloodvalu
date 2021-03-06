import Axios from "../../axios";

import {setAllRequests} from "./bloodRequestActions";
import {setAllTests} from "./offeredTestActions";


export const searchAllRequestsAndTestsAction = (searchString, searchType) => async (dispatch) => {
    try {
        const response = await Axios.get(`donor/search/?search_param=${searchString}&type=${searchType}`);
        const {data} = response
        if (searchType === 'requests' || searchType === 'applied') dispatch(setAllRequests(data))
        if (searchType === 'tests') dispatch(setAllTests(data))
        return response
    } catch (error) {
        return error
    }
}