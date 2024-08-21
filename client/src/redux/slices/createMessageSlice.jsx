import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const createMessage = createAsyncThunk (
    "message/create",
    async (payload) => {
        const response = await fetch(`${API_URL}/api/v1/sendmessage`, {
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

export const sendFile = createAsyncThunk (
    "message/file",
    async (payload) => {
        const formData = new FormData();

        formData.append("referredChat", payload.referredChat);
        formData.append("content", "");

        for (let i = 0; i < payload.files.length; i++) {
            console.log(payload.files[i]);
            
            formData.append('files', payload.files[i]);
        }
        
        const response = await fetch(`${API_URL}/api/v1/sendfiles`, {
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

export const sendVoice = createAsyncThunk (
    "message/voice",
    async (payload) => {
        const formData = new FormData();

        formData.append("referredChat", payload.referredChat);
        formData.append("content", "");
        formData.append('file', payload.file);

        const response = await fetch(`${API_URL}/api/v1/sendvoicenote`, {
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

const createMessageSlice = createSlice ({
    name: "createmessage",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createMessage.pending, (state) => {
            state.status = "loading";
        })
        .addCase(createMessage.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(createMessage.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })

        .addCase(sendFile.pending, (state) => {
            state.status = "loading";
        })
        .addCase(sendFile.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(sendFile.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })

        .addCase(sendVoice.pending, (state) => {
            state.status = "loading";
        })
        .addCase(sendVoice.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.data = action.payload;
            state.error = null;
        })
        .addCase(sendVoice.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error;
        })
    }
})

export default createMessageSlice.reducer;