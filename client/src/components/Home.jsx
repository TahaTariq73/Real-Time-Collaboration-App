import React, { Fragment, useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import Lottie from 'lottie-react';
import LoadingAnimation from "../assets/loading.json";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data, status, error, isAuthenticated } = useSelector((state) => state.user);

    const [loginFirst, setLoginFirst] = useState(true); // Login and Register hook
    
    useEffect(() => {
        dispatch(loadUser());
    }, [])

    useEffect(() => {
        if ((status == "succeeded" || status == "failed") && isAuthenticated) {
        navigate("/chats");
        } 
    }, [data, status, isAuthenticated])

    return (
        <Fragment>
            {status == "abc" ? (
                <div className="flex justify-center items-center h-[100vh] max-h-[100vh] w-full">
                    <Lottie animationData={LoadingAnimation} loop={true} className="w-80 min-w-80 max-w-80" />
                </div>
            ) : (
                <>
                {!isAuthenticated && 
                    <Fragment>
                        <div className="w-full px-4 h-[100vh] flex flex-col justify-center items-center bg-gradient-to-r from-purple-600 to-blue-600">
                            <div className="mb-9">
                                <span className="text-white text-3xl font-semibold"> Bladder . </span>
                            </div>

                            {loginFirst ? (
                                <Login loginFirst={loginFirst} setLoginFirst={setLoginFirst} />
                            ) : (
                                <Register loginFirst={loginFirst} setLoginFirst={setLoginFirst} />
                            )}
                        </div>
                    </Fragment>
                }
                </>
            )}
        </Fragment>
    )
}

export default Home;