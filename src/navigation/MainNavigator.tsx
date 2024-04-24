import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StackActions, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import database from "@react-native-firebase/database";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import ChatListScreen from "../screens/ChatListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import { RootStackParamList, TabParamList } from "./types";
import NewChatScreen from "../screens/NewChatScreen";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setChatsData } from "../store/chatSlice";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";
import { IObjectData, IChatData, IChatMessagesData } from "../types/types";
import { ActivityIndicator, View } from "react-native";
import colors from "../constants/colors";
import commonStyles from "../constants/commonStyles";
import ContactScreen from "../screens/ContactScreen";
import DataListScreen from "../screens/DataListScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ size, color }) => (
            <Icon name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ size, color }) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            headerTitle: "Contact info",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="DataList"
          component={DataListScreen}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: "containedModal",
        }}
      >
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

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
