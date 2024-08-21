import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = createAsyncThunk(
    "user/register",
    async (payload) => {
        const formData = new FormData();

        formData.append('name', payload.name);
        formData.append('email', payload.email);
        formData.append('password', payload.password);
        formData.append('file', payload.file);        

        const response = await fetch(`${API_URL}/api/v1/register`, {
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

export const loginUser = createAsyncThunk(
    "user/login",
    async (payload) => {
        console.log(API_URL);
        
        const response = await fetch(`${API_URL}/api/v1/login`, {
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

export const loadUser = createAsyncThunk(
    "user/loaduser",
    async () => {
        const response = await fetch(`${API_URL}/api/v1/me`, {
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

export const logout = createAsyncThunk(
    "user/logout",
    async () => {
        const response = await fetch(`${API_URL}/api/v1/logout`, {
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

const userSlice = createSlice ({
    name: "user",
    initialState: {
        data: null,
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.isAuthenticated = true;
            state.data = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.status = "failed";
            state.isAuthenticated = false;
            state.error = action.error;
        })
        
        .addCase(loginUser.pending, (state) => {            
            state.status = "loading";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.isAuthenticated = true;
            state.data = action.payload;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.isAuthenticated = false;
            state.error = action.error;
        })

        .addCase(loadUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.isAuthenticated = true;
            state.data = action.payload;
        })
        .addCase(loadUser.rejected, (state, action) => {
            state.status = "failed";
            state.isAuthenticated = false;
        })

        .addCase(logout.pending, (state) => {
            state.status = "loading";
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.isAuthenticated = false;
            state.data = action.payload;
        })
        .addCase(logout.rejected, (state, action) => {
            state.status = "failed";
            state.isAuthenticated = true;
        })
    }
})


export default userSlice.reducer;