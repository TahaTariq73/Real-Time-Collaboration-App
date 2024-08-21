import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUser } from './redux/slices/userSlice';
import Lottie from 'lottie-react';
import LoadingAnimation from "./assets/loading.json";

const ProtectedRoute = ({ Component }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, isAuthenticated } = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chats);

  useEffect(() => {
    dispatch(loadUser());
  }, [])

  useEffect(() => {
    if ((status == "succeeded" || status == "failed") && !isAuthenticated) {
      navigate("/");
    } 
  }, [data, status, isAuthenticated])

  return (
    <Fragment>
      {status == "loading" ? (        
        <div className="flex justify-center items-center h-[100vh] max-h-[100vh] w-full">
          <Lottie animationData={LoadingAnimation} loop={true} className="w-80 min-w-80 max-w-80" />
        </div>
      ) : (
        <>
          {isAuthenticated && 
          (
            <Component />
          )}
        </>   
      )}
    </Fragment>
  )
}

export default ProtectedRoute;