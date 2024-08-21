import React, { useState } from 'react';
import Sidebox from "./Sidebox";
import GroupChat from './GroupChat';
import AddContact from './AddContact';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";

const Sidebar = ({ selectedChat, setSelectedChat, socketConnected }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const chats = useSelector((state) => state.chats);

    const [searchOpen, setSearchOpen] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleClickOpen = () => {
        setIsOpen(true);
    }
    
    const handleClose = () => setIsOpen(false);
    const handleContactClose = () => setIsContactOpen(false);

    const logoutt = () => {
        dispatch(logout());
        
        window.location.reload();
    }

  return (
    <div className="bg-gray-100 h-full w-full max-h-[100vh] overflow-scroll no-scrollbar sm:border-r-2">
        <div className="flex justify-between items-center py-6 px-6 border-b-2">
            <div className="font-semibold text-xl"> Bladder . </div>

            <div className="flex gap-2">
                <button className='flex justify-center items-center w-10 h-10 rounded-full transition-all bg-gray-200 hover:bg-gray-300' onClick={logoutt}> 
                    <i class="fi fi-br-sign-out-alt"></i>
                </button>

                <button className='flex justify-center items-center w-10 h-10 rounded-full transition-all bg-gray-200 hover:bg-gray-300' onClick={() => setIsContactOpen(true)}> 
                    <i class="fi fi-br-user-add"></i>
                </button>

                <button className="flex justify-center items-center w-10 h-10 rounded-full transition-all bg-gray-200 hover:bg-gray-300" onClick={handleClickOpen}> 
                    <i class="fi fi-br-users-medical"></i>
                </button>
            </div>

            <GroupChat open={isOpen} setIsOpen={setIsOpen} onClose={handleClose} />
            <AddContact open={isContactOpen} setIsOpen={setIsContactOpen} onClose={handleContactClose} />
        </div>

        <div className={`pt-6 px-4 ${searchOpen ? "block" : "hidden"}`} style={{
            animation: "bounce 0.5s",
        }}>
            <div className="flex justify-between items-center px-6 py-2 bg-gray-50 rounded-full">
                <input type="text" placeholder="Search" className="bg-gray-50 w-full text-gray-900 focus:outline-none" disabled={chats?.data?.chats ? false : true} onChange={e => setSearchQuery(e.target.value)} value={searchQuery}></input>

                <div className='text-purple-700 flex justify-center items-center h-full'>
                    <i class="fi fi-br-search"></i> 
                </div>
            </div>
        </div>

        <div className="transition-all duration-300 py-6 w-full">
            <Sidebox 
                selectedChat={selectedChat} 
                setSelectedChat={setSelectedChat} 
                searchQuery={searchQuery} 
                socketConnected={socketConnected} 
            />
        </div>
    </div>
  )
}

export default Sidebar;