import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useSelector, useDispatch } from "react-redux";
import { createGroupChat } from "../redux/slices/createGrpChatSlice";
import { getSingleUser } from "../redux/slices/usersSlice";

const GroupChat = ({ onClose, open, setIsOpen }) => {
    const dispatch = useDispatch();

    const { data, status, error } = useSelector((state) => state.users);
    const chat = useSelector((state) => state.creategrpchat);

    const [groupName, setGroupName] = useState("");
    const [homieName, setHomieName] = useState("");
    const [homies, setHomies] = useState([]);
    const [homiesDetails, setHomiesDetails] = useState([]);
    const [files, setFiles] = useState([]);

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

    const addHomie = (event) => {
        if (event.key == "Enter") {
            dispatch(getSingleUser(homieName));
        }
    }

    const removeHomie = (val) => {
        setHomies(homies.filter(element => element !== val));
        setHomiesDetails(homiesDetails.filter(element => element._id !== val));            
    }

    const createGrpChat = () => {
        const details = {
            chatName: groupName,
            users: homies,
            file: files[0]
        }

        dispatch(createGroupChat(details));
    }
    
    useEffect(() => {
        if (data && open) {
            if (!homies.includes(data?.user._id)) {
                setHomies([...homies, data?.user._id]);
                setHomiesDetails([...homiesDetails, data?.user]);    
            }
        }
    }, [data])

    useEffect(() => {
        if (chat?.data) {
            setIsOpen(false);
            setGroupName("");
            setHomieName("");
            setFiles([]);
            setHomies([]);
            setHomiesDetails([]);
        }
    }, [chat?.data])

    return (
        <Dialog onClose={onClose} open={open}>
            <div className="px-6 py-6 min-w-80 sm:min-w-96">
                <div className="flex justify-between items-center mb-8">
                    <span className="font-semibold text-xl text-gray-900"> Create Group </span>

                    <button type="button" className='text-2xl transition-all hover:text-purple-700' onClick={() => setIsOpen(false)}>
                        <i class="fi fi-br-cross-small"></i>
                    </button>
                </div>

                <div className="mb-6">
                    <input type='file' onChange={e => setFiles(e.target.files)} />
                </div>

                <div className="mb-4">
                    <TextField id="outlined-basic" label="Group Name" variant="outlined" sx={style} size="small" value={groupName} onChange={(e) => setGroupName(e.target.value)} fullWidth />
                </div>

                <div className="">
                    <FormControl sx={style} size="small" fullWidth>
                        <InputLabel> Homies </InputLabel>
                            <OutlinedInput id="outlined-basic-2" label="Add Homie"
                            value={homieName}
                            onChange={(e) => setHomieName(e.target.value)}
                            onKeyDown={addHomie}
                            startAdornment={
                                <InputAdornment position="start">
                                    @
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                </div>

                {homies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5 max-w-80 sm:max-w-96">
                        {homiesDetails.map(homie => (
                            <Chip
                                key={homie._id}
                                label={`${homie.name}`}
                                variant="outlined"
                                onDelete={() => removeHomie(homie._id)}
                            />
                        ))}
                    </div>
                )}

                <div className={`${error && "mt-4"}`}>
                    {!chat?.error && error && open && (
                        <span className="text-red-700"> { error.message } </span>
                    )}

                    {chat?.error && open && (
                        <span className="text-red-700"> { chat?.error.message } </span>
                    )}
                </div>
                
                <button className="w-full mt-6 py-2.5  transition-all rounded-full bg-gradient-to-r  flex justify-center items-center text-gray-50 from-purple-700 to-blue-700 hover:opacity-90" onClick={createGrpChat}>
                    {status == "loading" ? (                    
                    <svg aria-hidden="true" class="w-6 h-6 text-gray-200 animate-spin fill-gray-50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                ) : (
                    <> Create </>
                )}
                </button>
            </div>
        </Dialog>
    )
}

export default GroupChat;