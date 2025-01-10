// import { useContext, useEffect, useState } from 'react';
// import './ProfileUpdate.css';
// import assets from '../../assets/assets';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// import db from '../../../instantdb/config';

// const ProfileUpdate = () => {
//   const [image, setImage] = useState(false);
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [uid, setUid] = useState("");
//   const [prevImage, setPrevImage] = useState("");
//   const { setUserData } = useContext(AppContext);
//   const navigate = useNavigate();

//   // Function to handle file upload
//   const uploadFile = async (file) => {
//     try {
//       const filePath = `avatars/${file.name}`; // Define the path for storage
//       await db.storage.upload(filePath, file); // Upload the file to InstantDB storage
//       const fileUrl = await db.storage.getDownloadURL(filePath); // Get the file URL
//       return fileUrl; // Return the URL to use in profile
//     } catch (error) {
//       console.error("File upload failed:", error);
//       toast.error("Failed to upload the file.");
//       throw error;
//     }
//   };

//   // Function to update profile
//   const profileUpdate = async (event) => {
//     event.preventDefault();
//     try {
//       if (!prevImage && !image) {
//         toast.error("Upload profile picture");
//         return;
//       }

//       const userKey = `users/${uid}`;

//       if (image) {
//         const imgUrl = await uploadFile(image); // Call uploadFile function
//         setPrevImage(imgUrl);
//         await db.update(userKey, { avatar: imgUrl, bio, name });
//       } else {
//         await db.update(userKey, { bio, name });
//       }

//       const userData = await db.get(userKey);
//       setUserData(userData);
//       navigate('/chat');
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update profile.");
//     }
//   };

//   useEffect(() => {
//     const checkAuth = async () => {
//       const user = await db.auth(); // Assuming db.auth() returns the current authenticated user
//       if (user) {
//         setUid(user.uid);
//         const userKey = `users/${user.uid}`;
//         const userData = await db.get(userKey);
//         if (userData.name) setName(userData.name);
//         if (userData.bio) setBio(userData.bio);
//         if (userData.avatar) setPrevImage(userData.avatar);
//       } else {
//         navigate("/");
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   return (
//     <div className='profile'>
//       <div className="profile-container">
//         <form onSubmit={profileUpdate}>
//           <h3>Profile details</h3>
//           <label htmlFor='avatar'>
//             <input
//               onChange={(e) => setImage(e.target.files[0])}
//               id='avatar'
//               type="file"
//               accept=".png, .jpg, .jpeg"
//               hidden
//             />
//             <img
//               src={image ? URL.createObjectURL(image) : assets.avatar_icon}
//               alt=""
//             />
//             Upload profile image
//           </label>
//           <input
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             placeholder='Your name'
//             type="text"
//             required
//           />
//           <textarea
//             onChange={(e) => setBio(e.target.value)}
//             value={bio}
//             placeholder='Write profile bio'
//             required
//           />
//           <button type="submit">Save</button>
//         </form>
//         <img
//           className='profile-pic'
//           src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon}
//           alt=""
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfileUpdate;


import { useState } from 'react';
import './ProfileUpdate.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const ProfileUpdate = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate('/chat'); // Navigate to chat page
  };

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={handleSave}>
          <h3>Profile details</h3>
          <label htmlFor='avatar'>
            <input
              id='avatar'
              type="file"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={assets.avatar_icon}
              alt="Avatar"
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder='Your name'
            type="text"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
          />
          <button type="submit">Save</button>
        </form>
        <img
          className='profile-pic'
          src={assets.logo_icon}
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
