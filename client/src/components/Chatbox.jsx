import React, { useState, useEffect, useRef } from 'react';
import Sendbox from './Sendbox';
import Chatting from './Chatting';
import { useDispatch, useSelector } from "react-redux";

const API_URL = import.meta.env.VITE_API_URL;

const Chatbox = ({ selectedChat, setSelectedChat, isSocketConnected, messages, setMessages }) => {
  const [currentChat, setCurrentChat] = useState([]);
  const { error, data, status } = useSelector((state) => state.accesschat);
  const messageData = useSelector((state) => state.createmessage);
  const userr = useSelector(state => state.user);

  const openNotifications = () => {

  }

  useEffect(() => {
    if (data?.chat) {
      setMessages(data?.messages);  
      setCurrentChat(data?.chat._id);
    }  
  }, [data, messageData.data])

  useEffect(() => {
    if (messageData.data?.message) {      
      setMessages([...messages, messageData.data?.message]);      
    }

    if (messageData.data?.messages) {
      setMessages([...messages, ...messageData.data?.messages]);
    }
  }, [messageData.data])

  return (
    <div className="relative h-full max-h-[100vh]">

      {data?.chat && status != "loading" && (
        <div className='absolute top-0 left-0 sm:hidden w-full flex justify-between items-center py-3 px-4 z-10 bg-gray-900'>
          <div className="flex justify-center items-center gap-3.5">
            <button className="text-gray-50 text-xl" onClick={() => setSelectedChat("")}>
              <i class="fi fi-br-arrow-small-left"></i>
            </button>
          
            {data?.chat.chatName == "sender" ? 
              userr?.data.user._id == data?.chat.users[0]._id ? (
                <img src={`${API_URL}/${data?.chat.users[1].profilePic}`} className='w-12 h-12 rounded-full' alt='' />
              ) : (
                <img src={`${API_URL}/${data?.chat.users[0].profilePic}`} className='w-12 h-12 rounded-full' alt='' />
              ) : (
                <img src={`${API_URL}/${data?.chat.chatIcon}`} className='w-12 h-12 rounded-full' alt='' />
              )
            }

            <span className='text-gray-50'>
              {data?.chat.chatName == "sender" ? 
              userr?.data.user._id == data?.chat.users[0]._id ? 
                `${data?.chat.users[1].name}` : 
                `${data?.chat.users[0].name}` :
                `${data?.chat.chatName}`
              }
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button className='flex justify-center items-center w-10 h-10 rounded-full transition-all text-gray-50 bg-gray-900' onClick={openNotifications}> 
              <i class="fi fi-br-bell"></i>
            </button>
          </div>
        </div>
      )}
      
      <div className="px-2 sm:px-8">
        {data?.chat ? (
          <>
            {data?.chat._id == currentChat && status != "loading" && (
              <Chatting messages={messages} setMessages={setMessages} isSocketConnected={isSocketConnected} />
            )}
          </>
        ) : ( 
          <div className="h-[100vh] flex justify-center items-center pb-12 text-sm text-gray-500">
            {status == "loading" ? "" : "Please select a chat to begin the conversation."}
          </div>
        )}
      </div>

      <Sendbox 
        isDisabled={data?.chat ? false : true} 
        messages={messages} 
        setMessages={setMessages}  
        isSocketConnected={isSocketConnected}
      />
    </div>
  )
}

export default Chatbox;