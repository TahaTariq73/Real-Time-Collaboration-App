import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const accessChat = createAsyncThunk (
    "chat/access",
    async (payload) => {
        const response = await fetch(`${API_URL}/api/v1/accesschat`, {
            method: 'POST',
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
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

const accessChatSlice = createSlice ({
    name: "accesschat",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(accessChat.pending, (state) => {
            state.status = "loading";
        })
        .addCase(accessChat.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(accessChat.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })
    }
})

export default accessChatSlice.reducer;