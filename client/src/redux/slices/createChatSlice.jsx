import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const createChat = createAsyncThunk (
    "chat/create",
    async (keyword) => {
        let response = await fetch(`${API_URL}/api/v1/user?keyword=${keyword}`, {
            credentials: "include"
        })

        if (!response.ok) {
            // Throw an error if response is not ok
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        let data = await response.json();
        data = {
            userId: data.user._id
        }

        response = await fetch(`${API_URL}/api/v1/createchat`, {
            method: 'POST',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            // Throw an error if response is not ok
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        data = await response.json(); // Parse the JSON response        
        return data;
    }
)

const createChatSlice = createSlice ({
    name: "createchat",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createChat.pending, (state) => {
            state.status = "loading";
        })
        .addCase(createChat.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(createChat.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })
    }
})

export default createChatSlice.reducer;