import React, { useEffect, useState, useRef } from 'react';
import Popover from '@mui/material/Popover';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import EmojiPicker from 'emoji-picker-react';
import { useSelector, useDispatch } from "react-redux";
import { sendVoice } from '../redux/slices/createMessageSlice';
import { createMessage } from '../redux/slices/createMessageSlice';
import socket from '../socket';
import SendFile from './SendFile';

const Sendbox = ({ isDisabled, isSocketConnected, messages, setMessages }) => {    
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const { error, data, status } = useSelector((state) => state.accesschat);
    const messageData = useSelector((state) => state.createmessage);
    const userr = useSelector(state => state.user);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [message, setMessage] = React.useState("");
    const [isTyping, setIsTyping] = useState(false);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioFile, setAudioFile] = useState(null);
    const audioChunksRef = useRef([]);
    const mediaRecorderRef = useRef(null);

    const handleClickOpen = () => {
        setIsOpen(true);
    }
    
    const handleClosse = () => setIsOpen(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const enterMessage = (event) => {
        if (event.key == "Enter") {
            sendMessage();
        }
    }

    const typingHandler = (event) => {
        setMessage(event.target.value);

        if (!isSocketConnected || !data?.chat) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", {
                room: data?.chat._id,
                user: userr?.data.user
            })

            var timerLength = 4000;
            
            setTimeout(() => {
                socket.emit("stop typing", {
                    room: data?.chat._id,
                    user: userr?.data.user
                });
                setIsTyping(false);
            }, timerLength);
        }
    }

    const sendMessage = () => {
        if (message != "" && data?.chat) {
            const details = {
                referredChat: data?.chat._id,
                content: message
            }
            
            dispatch(createMessage(details));
        }
    }

    const addEmoji = (emoji) => {
        setMessage(message + `${emoji.emoji}`)
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }

    const startRecording = async () => {        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
      
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            }
      
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], 'voice_note.wav', {
                    type: 'audio/wav',
                })
                
                setAudioFile(audioFile);                

                const details = {
                    referredChat: data?.chat._id,
                    file: audioFile
                }

                dispatch(sendVoice(details));
            }
      
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Microphone access is required to record audio. or Maybe device not found');
        }
    }

    const stopRecording  = () => {
        setIsRecording(false);
        mediaRecorderRef.current.stop();
    }

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isRecording && recordingTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording, recordingTime])

    useEffect(() => {
        if (messageData.data?.message) {
            setMessage("");
        }
    }, [messageData.data])

    return (
        <div className={`absolute bottom-0 border-t-2 px-3 z-10 sm:px-6 py-3 bg-gray-50 w-full ${isDisabled ? "disabled" : ""}`}>
            <div className="flex justify-between items-center bg-gray-200 py-3.5 px-6 w-full rounded-full">
                <div className="flex gap-2 w-full">
                    {isRecording ? (
                        <>
                            <button className="text-xl flex justify-center items-center cursor-default transition-all text-gray-600 hover:text-purple-700" onClick={stopRecording}> 
                                <i class="fi fi-br-stop-circle flex justify-center items-center"></i>
                            </button>

                            <span className="text-sm text-gray-500">
                                {formatTime(recordingTime)}
                            </span>
                        </>
                    ) : (
                        <button className="text-xl flex justify-center items-center cursor-default transition-all text-gray-600 hover:text-purple-700" onClick={startRecording} disabled={false}> 
                            <i class="fi fi-sc-microphone flex justify-center items-center"></i> 
                        </button>
                    )}
                    
                    <input type="text" className="w-full ml-2 mr-4 text-sm bg-gray-200 focus:outline-none"  placeholder="Type a message" value={message} onChange={typingHandler} onKeyDown={enterMessage} />
                </div>

                <div className="flex items-center gap-3 h-full">
                    <button className="text-xl flex justify-center items-center cursor-default transition-all text-gray-600 hover:text-purple-700" onClick={handleClickOpen}> 
                        <i class="fi fi-br-add-image flex justify-center items-center"></i> 
                    </button>

                    <SendFile setIsOpen={setIsOpen} open={isOpen} onClose={handleClosse} />
                    
                    <button className="text-xl flex justify-center items-center cursor-default transition-all text-gray-600 hover:text-purple-700" onClick={handleClick}> 
                        <i class="fi fi-br-grin flex justify-center items-center"></i> 
                    </button>

                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                    >
                        <EmojiPicker width={"300px"} height={"300px"} onEmojiClick={(e) => addEmoji(e)} />
                    </Popover>
                    
                    <div className="text-xl flex justify-center items-center cursor-default transition-all text-gray-600 hover:text-purple-700" onClick={sendMessage}> 
                        <i class="fi fi-br-paper-plane flex justify-center items-center"></i>                         
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sendbox;