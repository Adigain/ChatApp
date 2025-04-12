import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const cloudinaryAPI = process.env.REACT_APP_CLOUDINARY_API;
const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESENT;

export default function UploadImage({ handleFileUpload }) {

    const handleImageUpload = async (e) => {
        const uploadedImage = e.target.files[0];
        toast.warn('Uploading image.', { position: toast.POSITION.BOTTOM_LEFT });

        
        if (uploadedImage) {
            if (uploadedImage.size > 5242880) {
                toast.error('Image size should be less than 5MB.', { position: toast.POSITION.BOTTOM_LEFT });
                return;
            }

            const formData = new FormData();
            formData.append('file', uploadedImage);
            formData.append('upload_preset', uploadPreset);

            try {

                console.log(cloudinaryAPI);
                const response = await axios.post(cloudinaryAPI, formData);

                
                const imageUrl = response.data.secure_url;

                
                handleFileUpload(imageUrl)

            } catch (error) {
                
                toast.error('Image upload failed.', { position: toast.POSITION.BOTTOM_LEFT });
            }
        } else {
            toast.error('Please select an image file.', { position: toast.POSITION.BOTTOM_LEFT });
        }
    };


    return (
        <div div className="cursor-pointer w-full py-2 px-4 text-sm font-bold hover:bg-primary-800 hover:text-primary-50" >
            <label htmlFor="imageUpload" className="py-2 px-5 cursor-pointer">
                Change Picture
                <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />
            </label>

            <ToastContainer />
        </div>
    )
}
