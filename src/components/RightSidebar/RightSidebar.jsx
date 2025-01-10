import { useContext, useEffect, useState } from 'react';
import './RightSidebar.css';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import db from '../../../instantdb/config';


const RightSidebar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    // Extract all message images
    const tempVar = messages
      .filter((msg) => msg.image)
      .map((msg) => msg.image);
      
    setMsgImages(tempVar);
  }, [messages]);

  return chatUser ? (
    <div className="rs">
      <div className="rs-profile">
        <img src={chatUser.userData.avatar} alt="" />
        <h3>
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
            <img className="dot" src={assets.green_dot} alt="" />
          ) : null}
          {chatUser.userData.name}
        </h3>
        <p>{chatUser.userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          {msgImages.map((url, index) => (
            <img
              onClick={() => window.open(url)}
              key={index}
              src={url}
              alt=""
            />
          ))}
        </div>
      </div>
      <button onClick={() => db.logout()}>Logout</button>
    </div>
  ) : (
    <div className="rs">
      <button onClick={() => db.logout()}>Logout</button>
    </div>
  );
};

export default RightSidebar;
