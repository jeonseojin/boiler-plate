// 로그인 및 레지스터 기능을 만들때 설명
import {LOGIN_USER, REGISTER_USER} from '../_actions/types';

export default function (state = {}, action){
    switch (action.type) {
        case LOGIN_USER:
                return { ...state, loginSuccess: action.payload }
            break;

        default:
            return state;
    }

}