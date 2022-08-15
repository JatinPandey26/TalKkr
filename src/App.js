import React, { useState, useEffect, useRef } from "react";
import "./index.css";
import Message from "./components/message";
import {
  Box,
  Container,
  VStack,
  Button,
  HStack,
  Input,
} from "@chakra-ui/react";
import { app } from "./firebase";
import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { async } from "@firebase/util";

const auth = getAuth(app);
const db = getFirestore(app);

const logoutHandler = () => {
  signOut(auth);
};

const loginHandler = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider);
};

const App = () => {
  const [user, changeUserState] = useState(false);
  const [message, updateMessage] = useState("");
  const [messageArray, updateMessageArray] = useState([]);
  const divForScroll = useRef();
  
  useEffect(() => {
    const queryFromDB = query(
      collection(db, "Messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      changeUserState(data);
    });

    onSnapshot(queryFromDB, (snap) => {
      updateMessageArray(
        snap.docs.map((item) => {
          const id = item.id;
          return {
            id,
            ...item.data(),
          };
        })
      );
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const sendMssgHandler = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        email: user.email,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });

      updateMessage("");
      divForScroll.current.scrollIntoView({behaviour:'smooth'});
    } catch (error) {
      alert(error);
    }
  };

  return user ? (
    <Box h={"100vh"}>
      <Container h={"100vh"} bg={"twitter.100"} p="2">
        <VStack h={"full"}>
          <Button w={"full"} h="5%" colorScheme={"red"} onClick={logoutHandler}>
            Logout
          </Button>
          <VStack id="mssgSection" h={"full"} w={"full"} overflowY="auto">
            {messageArray.map((item) => (
           
              <Message
                key={item.id}
                text={item.text}
                uri={item.uri}
                user={item.email === user.email ? "me" : "other"}
              />

            ))}
            <div ref={divForScroll}></div>
          </VStack>
          <form
            style={{ width: "100%", float: "inline-end" }}
            onSubmit={sendMssgHandler}
          >
            <HStack w={"full"}>
              <Input
                id="mssgInput"
                value={message}
                bg={"white"}
                type="text"
                onChange={(e) => {
                  updateMessage(e.target.value);
                }}
              />
              <Button colorScheme={"purple"} type="submit">
                send
              </Button>
            </HStack>
          </form>
        </VStack>
      </Container>
    </Box>
  ) : (
    <Container
      h={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems="center"
    >
      <Button colorScheme={"yellow"} onClick={loginHandler}>
        Sign in with Google
      </Button>
    </Container>
  );
};

export default App;
