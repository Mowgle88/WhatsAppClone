import React, { useEffect, useState } from "react";
import { StackActions, useNavigation } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setChatsData } from "../store/chatSlice";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";
import {
  IObjectData,
  IChatData,
  IChatMessagesData,
} from "../shared/types/types";
import { ActivityIndicator, View } from "react-native";
import colors from "../shared/constants/colors";
import commonStyles from "../shared/constants/commonStyles";
import StackNavigator from "./components/StackNavigator";

const MainNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const userData = useAppSelector((state) => state.auth.userData);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleNotification = (
      remoteMessage: FirebaseMessagingTypes.RemoteMessage | null
    ) => {
      const chatId = remoteMessage?.data?.chatId;
      if (chatId) {
        const pushAction = StackActions.push("Chat", { chatId });
        navigation.dispatch(pushAction);
      }
    };

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        console.log(
          "App opened by notification from closed state:",
          remoteMessage
        );
        // Handle notification interaction when the app is opened from a closed state
        handleNotification(remoteMessage);
      });

    const unsubscribe = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "App opened by notification while in foreground:",
        remoteMessage
      );
      // Handle notification interaction when the app is in the foreground
      handleNotification(remoteMessage);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("Subscribing to firebase listening");

    const userChatsRef = database().ref(`userChats/${userData?.userId}`);
    const refs = [userChatsRef];

    userChatsRef.on("value", (querySnapshot) => {
      const chatIdsData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData: IObjectData<IChatData> = {};
      let chatsFoundCount = 0;

      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = database().ref(`chats/${chatId}`);
        refs.push(chatRef);

        chatRef.on("value", (chatSnapshot) => {
          chatsFoundCount++;
          const data: IChatData = chatSnapshot.val();

          const isUserIncluded = data.users.includes(userData!.userId);

          if (data && isUserIncluded) {
            data.key = chatSnapshot.key!;

            data.users.forEach((userId) => {
              const userRef = database().ref(`users/${userId}`);

              userRef.on("value", (userSnapshot) => {
                const userSnapshotData = userSnapshot.val();
                dispatch(setStoredUsers({ users: { userSnapshotData } }));
              });

              refs.push(userRef);
            });

            chatsData[chatSnapshot.key!] = data;

            if (chatsFoundCount >= chatIds.length) {
              dispatch(setChatsData({ chatsData }));
              setIsLoading(false);
            }
          }
        });

        const messagesRef = database().ref(`messages/${chatId}`);
        refs.push(messagesRef);

        messagesRef.on("value", (messagesSnaphot) => {
          const messagesData: IObjectData<IChatMessagesData> =
            messagesSnaphot.val();
          dispatch(setChatMessages({ chatId, messagesData }));
        });

        if (chatsFoundCount === 0) {
          setIsLoading(false);
        }
      }
    });

    const userStarredMessageRef = database().ref(
      `userStarredMessages/${userData?.userId}`
    );
    refs.push(userStarredMessageRef);

    userStarredMessageRef.on("value", (querySnapshot) => {
      const starredMessages = querySnapshot.val() ?? {};
      dispatch(setStarredMessages({ starredMessages }));
    });

    return () => {
      console.log("Unsubscribing to firebase lisstening");

      refs.forEach((chatsRef) => chatsRef.off());
    };
  }, []);

  if (isLoading) {
    <View style={commonStyles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>;
  }

  return <StackNavigator />;
};

export default MainNavigator;
