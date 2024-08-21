import { combineReducers } from "@reduxjs/toolkit";
import accessChatSlice from "./accessChatSlice";
import createChatSlice from "./createChatSlice";
import createGrpChatSlice from "./createGrpChatSlice";
import getChatsSlice from "./getChatsSlice";
import userSlice from "./userSlice";
import usersSlice from "./usersSlice";
import createMessageSlice from "./createMessageSlice";

const rootReducer = combineReducers({
    accesschat: accessChatSlice,
    createchat: createChatSlice,
    creategrpchat: createGrpChatSlice,
    chats: getChatsSlice,
    user: userSlice,
    users: usersSlice,
    createmessage: createMessageSlice
})

export default rootReducer;