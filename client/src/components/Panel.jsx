import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import Sidebar from './Sidebar';
import Chatbox from './Chatbox';
import { useSelector } from "react-redux";
import { accessChat } from "../redux/slices/accessChatSlice";
import socket from '../socket';

const Panel = () => {
    const dispatch = useDispatch();
    const [selectedChat, setSelectedChat] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentChat, setCurrentChat] = useState("");
    
    const { data, status, error } = useSelector((state) => state.user);
    const messageData = useSelector((state) => state.createmessage);
    const chatt = useSelector((state) => state.accesschat);
    const createchat = useSelector((state) => state.createchat);
    const creategrpchat = useSelector((state) => state.creategrpchat);

    useEffect(() => {
        if (selectedChat != "") {
            dispatch(accessChat({ chatId: selectedChat }))
        }
    }, [selectedChat])
 
    // Socket IO functions implementation

    useEffect(() => {
        socket.emit("setup", data?.user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])

    useEffect(() => {
        if (messageData.data?.message) {
            socket.emit("new message", messageData.data?.message);
        }

        if (messageData.data?.messages) {
            socket.emit("new messages", messageData.data?.messages);
        }
    }, [messageData.data])

    
    useEffect(() => {
        if (chatt.data?.chat) {
            socket.emit("join chat", {
                room: chatt.data?.chat._id,
                currentRoom: currentChat
            })

            setCurrentChat(chatt.data?.chat._id);
        }  
    }, [chatt.data])

    useEffect(() => {
        if (createchat.data?.chat) {
            socket.emit("new chat", {
                chat: createchat.data?.chat,
                createdBy: data?.user
            })
        }

        if (creategrpchat.data?.chat) {
            socket.emit("new chat", {
                chat: creategrpchat.data?.chat,
                createdBy: data?.user
            })
        }
    }, [createchat.data, creategrpchat.data])
    
    useEffect(() => {
        if (socketConnected) {
            socket.on("message recieved", (msg) => {
                setMessages([...messages, msg]);
            })

            socket.on("messages recieved", (msgs) => {
                // console.log(msgs);
                setMessages([...messages, ...msgs]);
            })
        }
    })

    return (
        <div className="flex h-screen">
            <div className={`w-full ${selectedChat ? "hidden" : "block"} sm:block sm:min-w-96 sm:w-96`}>
                <Sidebar 
                    selectedChat={selectedChat} 
                    setSelectedChat={setSelectedChat} 
                    socketConnected={socketConnected}    
                />
            </div>

            <div className={`bg-gray-200 ${selectedChat ? "block" : "hidden"} sm:block w-full`}>
                <Chatbox 
                    selectedChat={selectedChat} 
                    setSelectedChat={setSelectedChat} 
                    messages={messages}
                    setMessages={setMessages}
                    isSocketConnected={socketConnected} 
                />
            </div>
        </div>   
    )
}

export default Panel;