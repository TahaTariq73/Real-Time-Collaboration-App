import React, { useEffect, useState, useRef } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import Lottie from 'lottie-react';
import TypingAnimation from "../assets/typing.json";
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL;

const dateIntoMinutes = (createdAt) => {
    const date = new Date(createdAt);
    return format(date, 'HH:mm');
}

const dateIntoDay = (createdAt) => {
    const date = new Date(createdAt);
    return format(date, 'd MMMM'); // e.g., '2024-07-31'
}

const DayStampTemplate = ({ createdAt }) => {
    const date = new Date(createdAt);
    const day = format(date, 'EEEE'); // e.g., 'Wednesday'
    const formattedDate = format(date, 'd MMMM'); // e.g., '2024-07-31'
    
    let phrase = "";
    if (isToday(date)) {
        phrase = "Today";
    } else if (isYesterday(date)) {
        phrase = "Yesterday";        
    } else {
        phrase = day;
    }

    return (
        <div className="flex justify-center items-center my-2 mb-6"> 
            <span className="bg-gray-50 text-sm px-4 py-1 rounded-full"> &#128522; {phrase}, {formattedDate} </span>
        </div>
    )
}

const RenderFile = ({ fileType, fileUrl }) => {
    if (fileType == "audio/mpeg" || fileType == "audio/wav") {
        return (
            <audio className="mt-2" controls >
                <source src={`${API_URL}/${fileUrl}`} type={fileType} />
            </audio>
        )
    } else if (fileType == "video/mp4" || fileType == "video/mkv") {
        return (
            <video src={`${API_URL}/${fileUrl}`} className="max-w-[320px] mt-2 rounded-xl" controls />
        )
    } else if (fileType == "image/jpeg" || fileType == "image/png" || fileType == "image/gif") {
        return (
            <img src={`${API_URL}/${fileUrl}`} alt="" className="max-w-[320px] mt-2 rounded-xl" />
        )
    }
}

const ParentMessageTemplate = ({ isItMyMessage, sendBy, message, createdAt, fileType, fileUrl }) => {
    const time = dateIntoMinutes(createdAt);    

    return (
        <div className={`flex justify-${isItMyMessage ? "end" : "start"} items-center`}>
            {isItMyMessage ? (
                <div class="flex items-start my-2 sm:my-1">                    
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-s-xl rounded-ee-xl">
                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-50"> You </span>
                            <span class="text-sm font-normal text-gray-100"> {time} </span>
                        </div>
                
                        {fileUrl == "" ? (
                            <p class="text-sm font-normal py-2.5 text-gray-50"> {message} </p>
                        ) : (
                            <RenderFile fileType={fileType} fileUrl={fileUrl} />
                        )}
                    </div>
                </div>
            ) : (
                <div class="flex items-start gap-2.5 my-2 sm:my-1">
                    <img class="w-8 h-8 rounded-full" src={`${API_URL}/${sendBy.profilePic}`} alt="" />
                    
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-3 bg-gray-50 rounded-e-xl rounded-es-xl">
                        <div class="flex items-center space-x-2 rtl:space-x-reverse">
                            <span class="text-sm font-semibold text-gray-900"> {sendBy.name} </span>
                            <span class="text-sm font-normal text-gray-500"> {time} </span>
                        </div>
                
                        {fileUrl == "" ? (
                            <p class="text-sm font-normal py-2.5 text-gray-900"> {message} </p>
                        ) : (
                            <RenderFile fileType={fileType} fileUrl={fileUrl} />
                        )}
                    </div>
                </div>
            )} 
        </div>
    )
}

const FollowedMessage = ({ isItMyMessage, sendBy, message, createdAt, fileType, fileUrl }) => {
    const time = dateIntoMinutes(createdAt);

    return (
        <div className={`flex justify-${isItMyMessage ? "end" : "start"} items-center`}>
            {isItMyMessage ? (
                <div class="flex items-start my-2 sm:my-1">                    
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5 py-2 px-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-s-xl rounded-ee-xl">
                        {fileUrl == "" ? (
                            <p class="text-sm font-normal py-2.5 text-gray-50"> {message} </p>
                        ) : (
                            <RenderFile fileType={fileType} fileUrl={fileUrl} />
                        )}
                    </div>
                </div>
            ) : (
                <div class="flex items-start gap-2.5 my-2 sm:my-1">
                    <div class="flex flex-col w-full max-w-[320px] leading-1.5 p-3 bg-gray-50 rounded-e-xl rounded-es-xl ml-[42px]">
                        {fileUrl == "" ? (
                            <p class="text-sm font-normal py-2.5 text-gray-900"> {message} </p>
                        ) : (
                            <RenderFile fileType={fileType} fileUrl={fileUrl} />
                        )}
                    </div>
                </div>
            )} 
        </div>
    )
}

const Chatting = ({ messages, setMessages }) => {
    const { error, data, status } = useSelector((state) => state.accesschat);
    const userr = useSelector(state => state.user);
    const scrollRef = useRef(null);    

    const [otherUsersTyping, setOtherUsersTyping] = useState([]);

    useEffect(() => {
        socket.on("typing", (user) => {
            setOtherUsersTyping([...otherUsersTyping, user]);
        })

        socket.on("stop typing", (user) => {
            setOtherUsersTyping((prev) => prev.filter(user1 => user1._id !== user._id));
        })
    })

    useEffect(() => {
        const div = scrollRef.current;
        if (div) {
            div.scrollTop = div.scrollHeight;
        }
    }, [messages]);

    const userId = userr?.data.user._id;

    return (
        <div className="flex flex-col py-24 sm:py-6 sm:pb-24 no-scrollbar h-full overflow-scroll max-h-[100vh]" ref={scrollRef}>
            {data?.chat && messages.map((message, index) => {                
                const prevMessage = (index - 1) == -1 ? messages[index] : messages[index - 1];

                if (index != 0) {
                    const prevMessage = messages[index - 1];

                    if (dateIntoMinutes(prevMessage.createdAt) ==  dateIntoMinutes(message.createdAt) && 
                        prevMessage.sender._id == message.sender._id) {
                        return (
                            <>
                                <FollowedMessage key={index} isItMyMessage={userId == message.sender._id} sendBy={message.sender} message={message.content} createdAt={message.createdAt} fileType={message.fileType} fileUrl={message.fileUrl} />
                            </>
                        )
                    }
                }

                return (
                    <>
                        {dateIntoDay(message.createdAt) != dateIntoDay(prevMessage.createdAt) ? (
                            <DayStampTemplate key={`f-${index}`} createdAt={message.createdAt} />    
                        ) : (
                            <></>
                        )}
                        {index == 0 && (
                            <DayStampTemplate key={`g-${index}`} createdAt={message.createdAt} />    
                        )}
                        <ParentMessageTemplate key={index} isItMyMessage={userId == message.sender._id} sendBy={message.sender} message={message.content} createdAt={message.createdAt} fileType={message.fileType} fileUrl={message.fileUrl} />
                    </>
                )
            })}

            {otherUsersTyping.length > 0 && otherUsersTyping.map(user => (
                <div class="flex items-start gap-2.5 my-2 sm:my-1">
                    <img class="w-8 h-8 rounded-full" src={`${API_URL}/${user.profilePic}`} alt="" />
                
                    <div class="flex flex-col max-w-[320px] leading-1.5 bg-gray-50 rounded-e-xl rounded-es-xl">
                        <Lottie animationData={TypingAnimation} loop={true} className="w-12 min-w-12 max-w-12" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Chatting;