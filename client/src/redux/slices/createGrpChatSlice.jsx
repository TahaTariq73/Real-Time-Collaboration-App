import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { formatDate } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

export const createGroupChat = createAsyncThunk (
    "chat/grpcreate",
    async (payload) => {
        const formData = new FormData();

        formData.append("chatName", payload.chatName);
        formData.append("file", payload.file);

        for (let i = 0; i < payload.users.length; i++) {
            formData.append('users', payload.users[i]);
        }

        const response = await fetch(`${API_URL}/api/v1/creategroupchat`, {
            method: 'POST',
            credentials: "include",
            body: formData
        })

        if (!response.ok) {
            // Throw an error if response is not ok
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        const data = await response.json(); // Parse the JSON response        
        return data;
    }
)

const createGroupChatSlice = createSlice ({
    name: "creategrpchat",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createGroupChat.pending, (state) => {
            state.status = "loading";
        })
        .addCase(createGroupChat.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(createGroupChat.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })
    }
})

export default createGroupChatSlice.reducer;