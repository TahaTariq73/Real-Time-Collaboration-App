import React, { Fragment, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loadUser } from '../redux/slices/userSlice';

const Register = ({ loginFirst, setLoginFirst }) => {
    const dispatch = useDispatch();
    const { data, status, error, isAuthenticated } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [files, setFiles] = useState([]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }

    const register = () => {
        dispatch(registerUser({ name, email, password, file: files[0] }));
    }

    const style = {
        "& label.Mui-focused": {
            color: "#7b1fa2"
        },
        "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
                borderColor: "#7b1fa2"
            }
        }
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg w-full sm:max-w-96">
            <div className="flex justify-center items-center mb-6">
                <span className="font-semibold text-2xl text-gray-900"> Register </span>
            </div>

            <div className="mb-4">
                <TextField id="outlined-basic" label="Name" variant="outlined" sx={style} value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            </div>

            <div className="mb-4">
                <TextField id="outlined-basic" label="Email" variant="outlined" sx={style} value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            </div>

            <div className={`${error ? "mb-4" : "mb-6"}`}>
                <FormControl sx={style} fullWidth>
                    <InputLabel> Password </InputLabel>
                        <OutlinedInput id="outlined-basic-2" label="Password" type={showPassword ? 'text' : 'password'}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                    {showPassword ? <i class="fi fi-br-eye-crossed"></i> : <i class="fi fi-br-eye"></i>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>

            <div className="mb-4">
                <input type="file" onChange={e => setFiles(e.target.files)} />
            </div>

            <div className={`${error && "mb-6"}`}>
                {error && (
                    <span className="text-red-700"> { error.message } </span>
                )}
            </div>

            <button type="button" className="flex justify-center items-center w-full uppercase bg-purple-700 text-gray-50 py-3.5 transition-all rounded-full hover:bg-purple-600" onClick={register} disabled={status == "loading" ? true : false}> {status == "loading" ? (                    
                <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin fill-gray-50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            ) : (
                <> Register </>
            )}
            </button>

            <div className="flex justify-center mt-4">
                <span> Already have an account? 
                    <span className="underline cursor-pointer text-blue-700  hover:text-blue-600" onClick={() => {
                        setLoginFirst(!loginFirst);
                    }}> Login </span> 
                </span>
            </div>
        </div>
    )
}

export default Register;