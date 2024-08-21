import React, { useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import Highlighter from "react-highlight-words";
import { useSelector, useDispatch } from "react-redux";
import { getAllChats } from "../redux/slices/getChatsSlice";
import { format } from 'date-fns';
import socket from "../socket";

const API_URL = import.meta.env.VITE_API_URL;

const Sidebox = ({ selectedChat, setSelectedChat, searchQuery, socketConnected }) => {    
    const dispatch = useDispatch();
    const { status, data, error } = useSelector((state) => state.chats);
    const userr = useSelector(state => state.user);
    const createchat = useSelector((state) => state.createchat);
    const creategrpchat = useSelector((state) => state.creategrpchat);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        dispatch(getAllChats());        
    }, [createchat?.data, creategrpchat?.data])

    useEffect(() => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const filtered = data?.chats.filter((chat) => {
                if (chat.chatName == "sender") {
                    if (userr?.data.user._id == chat?.users[0]._id) {
                        return chat?.users[1].name.toLowerCase().includes(query);
                    } else {
                        return chat?.users[0].name.toLowerCase().includes(query);
                    }
                } else {
                    return chat.chatName.toLowerCase().includes(query);
                }
            })

            setFilteredData(filtered);
        } else {
            setFilteredData(data?.chats);
        }
    }, [data, searchQuery])

    useEffect(() => {
        socket.on("chat created", (chat) => {
            if (socketConnected && filteredData != undefined) {
                setFilteredData([...filteredData, chat]);                
            }
        })
    })

    const dateIntoMinutes = (createdAt) => {
        const date = new Date(createdAt);
        return format(date, 'HH:mm');
    }  

    return (
        <div className="flex flex-col">
            {status == "loading" ? (
                <> 
                    {[0, 1, 2].map(index => (
                        <div key={index} className="flex justify-start items-center px-6 py-2 gap-4 cursor-default transition-all">
                            <Skeleton variant="rectangular" height={60} width={"100%"} className="rounded-lg" />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {data?.chats && filteredData?.length > 0 && filteredData.map((chat, index) => {
                        const targetUser = `${chat.chatName == "sender" ? 
                        userr?.data.user._id == chat?.users[0]._id ? chat?.users[1].profilePic : chat?.users[0].profilePic :
                        chat.chatIcon}`

                        return (      
                        <div key={index} className={`flex justify-start items-center px-6 py-3 gap-4 cursor-default transition-all hover:bg-purple-200`} onClick={() => setSelectedChat(`${chat._id}`)}>
                            <img src={`${API_URL}/${targetUser}`} className="w-14 h-14 rounded-full" />

                            <div className="w-full">
                                <div className="grid grid-cols-4 items-center">
                                    <span className="text-gray-900 text-md text-nowrap truncate col-span-3"> 
                                        {chat.chatName == "sender" ? 
                                        userr?.data.user._id == chat?.users[0]._id ? (
                                            <Highlighter
                                                highlightClassName="bg-purple-300"
                                                searchWords={[searchQuery]}
                                                autoEscape={true}
                                                textToHighlight={chat?.users[1].name}
                                            />
                                        ) : (
                                            <Highlighter
                                                highlightClassName="bg-purple-300"
                                                searchWords={[searchQuery]}
                                                autoEscape={true}
                                                textToHighlight={chat?.users[0].name}
                                            />
                                        ) : (
                                            <Highlighter
                                                highlightClassName="bg-purple-300"
                                                searchWords={[searchQuery]}
                                                autoEscape={true}
                                                textToHighlight={chat.chatName}
                                            />
                                        )
                                        } 
                                    </span>

                                    <span className="text-gray-500 text-sm text-nowrap col-span-1 flex justify-end"> {dateIntoMinutes(chat.updatedAt)} </span>
                                </div>

                                <div className="grid grid-cols-4 items-center">
                                    <span className="text-gray-600 text-sm text-nowrap truncate col-span-3"> 
                                        {chat.latestMessage ? `${chat.latestMessage.content}` : `Hi! There I am using Bladder`} 
                                    </span>

                                    {/* {user.numUnseenMessages > 0 && (
                                        <div className="flex justify-end col-span-1">
                                            <span className="bg-purple-700 text-gray-50 flex justify-center items-center rounded-full text-xs p-1 w-5 h-5"> 
                                                {user.numUnseenMessages}
                                            </span>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div> 
                    )})}
                </>
            )}
        </div>
    )
}

export default Sidebox;