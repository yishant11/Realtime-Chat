// /* eslint-disable react/prop-types */
// // import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
// // import { createContext, useEffect, useState } from "react";
// // import { auth, db } from "../config/firebase";
// // import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";

// // export const AppContext = createContext()

// // const AppContextProvider = (props) => {

// //     const [userData, setUserData] = useState(null);
// //     const [chatData, setChatData] = useState(null);
// //     const [messagesId, setMessagesId] = useState(null);
// //     const [messages, setMessages] = useState([])
// //     const [chatUser, setChatUser] = useState(null);
// //     const [chatVisible,setChatVisible] = useState(false);
// //     const navigate = useNavigate();

// //     const loadUserData = async (uid) => {
// //         try {
// //             const userRef = doc(db, 'users', uid);
// //             const userSnap = await getDoc(userRef);
// //             const userData = userSnap.data();
// //             setUserData(userData);
// //             if (userData.avatar && userData.name) {
// //                 navigate('/chat');
// //             }
// //             else {
// //                 navigate('/profile')
// //             }
// //             await updateDoc(userRef, {
// //                 lastSeen: Date.now()
// //             })
// //             setInterval(async () => {
// //                 if (auth.chatUser) {
// //                     await updateDoc(userRef, {
// //                         lastSeen: Date.now()
// //                     })
// //                 }
// //             }, 60000);
// //         } catch (error) {
// //             toast.error(error.message)
// //         }
// //     }

// //     useEffect(() => {
// //         if (userData) {
// //             const chatRef = doc(db, 'chats', userData.id)
// //             const unSub = onSnapshot(chatRef, async (res) => {
// //                 const chatItems = res.data().chatsData;
// //                 const tempData = [];
// //                 for (const item of chatItems) {
// //                     const userRef = doc(db, "users", item.rId);
// //                     const userSnap = await getDoc(userRef);
// //                     const userData = userSnap.data();
// //                     tempData.push({ ...item, userData });
// //                 }
// //                 setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
// //             })

// //             return () => {
// //                 unSub();
// //             }
// //         }
// //     }, [userData])



// //     useEffect(() => {
// //         if (userData) {
// //             setInterval(async () => {
// //                 const chatRef = doc(db, 'chats', userData.id)
// //                 const data = await getDoc(chatRef)
// //                 const chatItems = data.data().chatsData;
// //                 const tempData = [];
// //                 for (const item of chatItems) {
// //                     const userRef = doc(db, "users", item.rId);
// //                     const userSnap = await getDoc(userRef);
// //                     const userData = userSnap.data();
// //                     tempData.push({ ...item, userData });
// //                 }
// //                 setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
// //             }, 10000);
// //         }
// //     }, [userData])

// //     const value = {
// //         userData,setUserData,
// //         loadUserData,
// //         chatData,
// //         messagesId,
// //         setMessagesId,
// //         chatUser, setChatUser,
// //         chatVisible,setChatVisible,
// //         messages,setMessages
// //     }

// //     return (
// //         <AppContext.Provider value={value}>
// //             {props.children}
// //         </AppContext.Provider>
// //       );
// //     };
    


import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import  db  from '../../instantdb/config';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);
  const navigate = useNavigate();

  const loadUserData = async (uid) => {
    try {
      const userRef = db.doc(`users/${uid}`);
      const userSnap = await db.get(userRef);
      setUserData(userSnap);

      if (userSnap.avatar && userSnap.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      await db.update(userRef, { lastSeen: Date.now() });

      setInterval(async () => {
        if (db.auth.currentUser) {
          await db.update(userRef, { lastSeen: Date.now() });
        }
      }, 60000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = db.doc(`chats/${userData.id}`);
      const unSub = db.onSnapshot(chatRef, async (res) => {
        const chatItems = res.chatsData || [];
        const tempData = [];
        for (const item of chatItems) {
          const userRef = db.doc(`users/${item.rId}`);
          const userSnap = await db.get(userRef);
          tempData.push({ ...item, userData: userSnap });
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => unSub();
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      setInterval(async () => {
        const chatRef = db.doc(`chats/${userData.id}`);
        const chatData = await db.get(chatRef);

        if (chatData && chatData.chatsData) {
          const chatItems = chatData.chatsData;
          const tempData = [];
          for (const item of chatItems) {
            const userRef = db.doc(`users/${item.rId}`);
            const userSnap = await db.get(userRef);
            tempData.push({ ...item, userData: userSnap });
          }
          setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      }, 10000);
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    loadUserData,
    chatData,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible,
    messages,
    setMessages,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;
