import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAccount, updateUserData } from '../redux/authReducer/action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadImage from './CommonComponents/UploadImage';


export default function UserProfile() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useDispatch();
  const popupRef = useRef(null);
  const user_update_success = useSelector((state) => state.authReducer.user_update_success);
  const user_update_failed = useSelector((state) => state.authReducer.user_update_failed);
  const user_update_processing = useSelector((state) => state.authReducer.user_update_processing);
  const user_update_message = useSelector((state) => state.authReducer.user_update_message);
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("chat-app-login-user-data")));

  const handleProfileClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };


  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);


  
  useEffect(() => {

    
    if (user_update_success && !user_update_processing && !user_update_failed) {

      
      setUserData(JSON.parse(localStorage.getItem("chat-app-login-user-data")))
      toast.success(user_update_message, { position: toast.POSITION.BOTTOM_LEFT });
    }
    else if (!user_update_success && !user_update_processing && user_update_failed) {
      
      toast.error(user_update_message, { position: toast.POSITION.BOTTOM_LEFT });
    }

  }, [user_update_success, user_update_processing, user_update_failed])

  
  const handleLogout = () => {
    toast.success('Logout Success.', { position: toast.POSITION.BOTTOM_LEFT });
    setTimeout(() => { dispatch(logoutAccount()) }, 1500)
  }

  
  const handleFileUpload = (data) => {
    dispatch(updateUserData(data, userData.token))
  }


  return (
    <div className="relative">

      
      <button
        className="bg-primary-50 rounded-full w-11 h-11 flex items-center justify-center"
        onClick={handleProfileClick}
      >
        <img
          className={`w-10 h-10 rounded-full `}
          src={userData.pic}
          alt="Profile"
        />
      </button>

      
      {isPopupOpen && (
        <div ref={popupRef} className="text-center text-primary-800 absolute right-0 min-w-[200px] w-25vw bg-primary-50 rounded-md shadow-xl">
          <div className="text-center p-6 border-b relative">
            <img
              className={`cursor-pointer h-full w-full rounded-full`}
              src={userData.pic}
              alt="Profile"
            />
          </div>

          
          <p className="pt-2 text-lg font-semibold">{userData.name}</p>
          <p className="text-sm mb-2">{userData.email}</p>

          
          <UploadImage handleFileUpload={handleFileUpload} />

          
          <button onClick={(e) => { handleLogout() }} className="cursor-pointer w-full py-2 px-4 text-sm font-bold hover:bg-primary-800 hover:text-primary-50">
            LOGOUT
          </button>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
