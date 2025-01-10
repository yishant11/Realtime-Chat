import  { useContext, useEffect, useRef, useState } from 'react';
import './ChatBox.css';
import assets from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { init } from '@instantdb/react';
import { toast } from 'react-toastify';
//import { upload } from '../../utils/upload';



const db = init({
  appId: 'd6207e60-ecda-476b-b786-b55c8c249df7',
});


const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible } = useContext(AppContext);
  const [input, setInput] = useState('');
  const scrollEnd = useRef();

  const sendMessage = async () => {
    if (!input || !messagesId) return;

    try {
      // Update chat messages in InstantDB
      await db.collection('messages').doc(messagesId).update({
        messages: db.arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date(),
        }),
      });

      const userIDs = [chatUser.rId, userData.id];

      for (const id of userIDs) {
        const userChatsRef = db.collection('chats').doc(id);
        const userChatsSnapshot = await userChatsRef.get();

        if (userChatsSnapshot.exists) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === messagesId);

          userChatsData.chatsData[chatIndex].lastMessage = input;
          userChatsData.chatsData[chatIndex].updatedAt = Date.now();
          if (userChatsData.chatsData[chatIndex].rId === userData.id) {
            userChatsData.chatsData[chatIndex].messageSeen = false;
          }

          await userChatsRef.update({
            chatsData: userChatsData.chatsData,
          });
        }
      }
    } catch (error) {
      toast.error(error.message);
    }

    setInput('');
  };

  const sendImage = async (e) => {
    const fileUrl = await upload(e.target.files[0]);

    if (fileUrl && messagesId) {
      await db.collection('messages').doc(messagesId).update({
        messages: db.arrayUnion({
          sId: userData.id,
          image: fileUrl,
          createdAt: new Date(),
        }),
      });

      const userIDs = [chatUser.rId, userData.id];

      for (const id of userIDs) {
        const userChatsRef = db.collection('chats').doc(id);
        const userChatsSnapshot = await userChatsRef.get();

        if (userChatsSnapshot.exists) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chatsData.findIndex((c) => c.messageId === messagesId);

          userChatsData.chatsData[chatIndex].lastMessage = 'Image';
          userChatsData.chatsData[chatIndex].updatedAt = Date.now();
          await userChatsRef.update({
            chatsData: userChatsData.chatsData,
          });
        }
      }
    }
  };

  const convertTimestamp = (timestamp) => {
    let date = new Date(timestamp);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formattedTime = hour > 12 ? `${hour - 12}:${minute} PM` : `${hour}:${minute} AM`;
    return formattedTime;
  };

  useEffect(() => {
    if (messagesId) {
      const unSub = db.collection('messages').doc(messagesId).onSnapshot((doc) => {
        setMessages(doc.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? '' : 'hidden'}`}>
      <div className="chat-user">
        <img src={chatUser ? chatUser.userData.avatar : assets.profile_img} alt="" />
        <p>
          {chatUser ? chatUser.userData.name : 'Richard Sanford'}{' '}
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className="dot" src={assets.green_dot} alt="" /> : null}
        </p>
        <img onClick={() => setChatVisible(false)} className="arrow" src={assets.arrow_icon} alt="" />
        <img className="help" src={assets.help_icon} alt="" />
      </div>
      <div className="chat-msg">
        <div ref={scrollEnd}></div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
            {msg.image ? (
              <img className="msg-img" src={msg.image} alt="" />
            ) : (
              <p className="msg">{msg.text}</p>
            )}
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input onChange={sendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className={`chat-welcome ${chatVisible ? '' : 'hidden'}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;
