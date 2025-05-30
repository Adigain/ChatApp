import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeGroupName, getChats, removeMembersFromGroup } from '../../../redux/appReducer/action';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import Badge from '../../CommonComponents/Badge';

export default function RemoveMembers() {

    const dispatch = useDispatch();
    const [showModel, setShowModel] = useState(false);
    const selectedUserForChat = useSelector((state) => state.appReducer.selectedUserForChat);
    const removeMembersFromGroupFail = useSelector((state) => state.appReducer.removeMembersFromGroupFail);
    const removeMembersFromGroupSuccess = useSelector((state) => state.appReducer.removeMembersFromGroupSuccess);
    const removeMembersFromGroupProcessing = useSelector((state) => state.appReducer.removeMembersFromGroupProcessing);
    const [groupMembers, setGroupMembers] = useState(selectedUserForChat.users);
    const [removeMembers, setRemoveMembers] = useState([]);
    
    
    const toggleModel = () => {
        setShowModel(!showModel);
    };


    
    const removeUser = (userId) => {
        setGroupMembers((prevState) => {
            const filteredMembers = prevState.filter((user) => user._id !== userId);
            const removedUser = prevState.find((user) => user._id === userId);
            if (removedUser) {
                setRemoveMembers((prevRemoveMembers) => [...prevRemoveMembers, removedUser]);
            }
            return filteredMembers;
        });
    };


    
    const addUser = (userId) => {
        setRemoveMembers((prevRemoveMembers) => {
            const filteredMembers = prevRemoveMembers.filter((user) => user._id !== userId);
            const addedUser = prevRemoveMembers.find((user) => user._id === userId);
            if (addedUser) {
                setGroupMembers((prevGroupMembers) => [...prevGroupMembers, addedUser]);
            }
            return filteredMembers;
        });
    };


    
    const groupAdmin = () => {
        const admin = selectedUserForChat.users.find((user) => user._id === selectedUserForChat.groupAdmin);
        return admin.name;
    };

    
    const handleRemoveMembers = () => {
    const obj={
        chatId:selectedUserForChat._id,
        userId: removeMembers
    }
    dispatch(removeMembersFromGroup(obj))
    }


    
    useEffect(() => {
        if (removeMembersFromGroupSuccess && !removeMembersFromGroupFail && removeMembers.length>=1) {
            toast.success('Members successfully Removed from group.', { position: toast.POSITION.BOTTOM_LEFT });
            
            
            setRemoveMembers([])
            setGroupMembers([])

            setTimeout(() => {
                toggleModel();
            }, 1000);
        }

        if (removeMembersFromGroupFail && !removeMembersFromGroupProcessing && removeMembers.length>=1 ) {

            
            setRemoveMembers([])
            setGroupMembers([])

            toast.error('Failed to remove members from group.', { position: toast.POSITION.BOTTOM_LEFT });
        }
    }, [removeMembersFromGroupProcessing, removeMembersFromGroupFail, removeMembersFromGroupSuccess]);

    return (
        <div>
            <button className="cursor-pointer w-full py-2 px-4 text-sm font-bold hover:bg-primary-800 hover:text-primary-50" onClick={toggleModel}>
                Remove members
            </button>

            {showModel && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 backdrop-filter backdrop-blur-sm">
                    <div className="bg-primary-50 text-primary-800 rounded-lg p-4 max-w-md w-full">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold"> Remove members from group </h2>
                            <button className="hover:text-primary-500 text-primary-800 rounded-md py-1 px-2" onClick={toggleModel}>
                                <AiOutlineCloseCircle size={'25px'} />
                            </button>
                        </div>

                        
                        <p className="text-md font-semibold text-primary-800 truncate mt-4"> Group Admin - <span className='font-normal'> {groupAdmin()} </span></p>
                        <p className="text-md font-semibold text-primary-800 truncate mt-1 mb-4"> Total Members - <span className='font-normal'> {selectedUserForChat.users.length}  </span> </p>

                        
                        <p className="text-md font-semibold text-primary-800 truncate mt-1 "> Group Members </p>
                        {groupMembers?.map((item) => {
                            if (item._id !== item.groupAdmin) {
                                return <Badge label={item.name} userId={item._id} removeUser={removeUser} key={item._id} />;
                            }
                        })}

                        
                        {removeMembers.length > 0 && <p className="text-md font-semibold text-primary-800 truncate  mt-4 "> Remove Members </p>}
                        {removeMembers?.map((item) => {
                            if (item._id !== item.groupAdmin) {
                                return <Badge label={item.name} userId={item._id} removeUser={addUser} key={item._id} />;
                            }
                        })}

                    
                    <button
                        className={`bg-primary-800 float-right mt-5 hover:bg-primary-900 text-primary-50 rounded-md py-1 px-4  ${removeMembersFromGroupProcessing ? 'opacity-50 cursor-not-allowed' : ""}`}
                        onClick={handleRemoveMembers}
                    >
                        {removeMembersFromGroupProcessing ? (
                            <div className="flex items-center justify-center">
                                <span className="mr-2">Removing</span>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            'Remove'
                        )}
                    </button>
                    </div>

                </div>
            )}
        </div>
    );
}
