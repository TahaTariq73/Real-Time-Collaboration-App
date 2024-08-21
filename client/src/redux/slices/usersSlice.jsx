import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const getSingleUser = createAsyncThunk (
    "users/single",
    async (keyword) => {
        const response = await fetch(`${API_URL}/api/v1/user?keyword=${keyword}`, {
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

const usersSlice = createSlice ({
    name: "users",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getSingleUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(getSingleUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(getSingleUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })
    }
})

export default usersSlice.reducer;