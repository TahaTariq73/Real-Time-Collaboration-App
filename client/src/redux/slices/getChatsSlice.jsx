import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllChats = createAsyncThunk (
    "chats/all",
    async () => {
        const response = await fetch(`${API_URL}/api/v1/getallchats`, {
            credentials: "include"
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

const getChatsSlice = createSlice ({
    name: "chats",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getAllChats.pending, (state) => {
            state.status = "loading";
        })
        .addCase(getAllChats.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
        })
        .addCase(getAllChats.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })
    }
})

export default getChatsSlice.reducer;