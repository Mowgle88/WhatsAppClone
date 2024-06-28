import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "react-native-image-crop-picker";
import { useOverflowMenu } from "react-navigation-header-buttons";
import ScreenContainer from "../../shared/ui/ScreenContainer";
import {
  ChatScreenRouteProp,
  RootScreenNavigationProps,
} from "../../navigation/types";
import {
  BubbleEnum,
  IChatMessagesData,
  ISendedData,
  IUserData,
} from "../../shared/types/types";
import { useAppSelector } from "../../store/hooks";
import {
  createChat,
  sendImage,
  sendTextMessage,
} from "../../shared/utils/actions/chatActions";
import {
  openCamera,
  showImagePicker,
  uploadImageAsync,
} from "../../shared/utils/imagePickerHelper";
import { updateSignedInUserData } from "../../shared/utils/actions/authActions";
import { updateLoggetInUserData } from "../../store/authSlice";
import { backgrounds } from "../../shared/constants/sources";
import HeaderRight from "./components/HeaderRight";
import SendImageModal from "./components/SendImageModal";
import ChatInput from "./components/ChatInput";
import Bubble from "./components/Bubble";
import ReplyTo from "./ui/ReplyTo";
import FloatingButton from "./ui/FloatingButton";

interface ItemData {
  item: {
    sentAt: string;
    sentBy: string;
    text: string;
    key: string;
    replyTo?: string | undefined;
    imageUrl?: string | undefined;
    type?: string | undefined;
  };
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatScreenRouteProp>();

  const flatList = useRef<any>();

  const dispatch = useDispatch();

  const { toggleMenu } = useOverflowMenu();

  const userData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const storedChats = useAppSelector((state) => state.chats.chatsData);
  const chatMesages = useAppSelector((state) => state.messages.messagesData);

  const [chatId, setChatId] = useState(route?.params?.chatId ?? "");
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<IChatMessagesData | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isShowFloatingButton, setIsShowFloatingButton] = useState(false);

  const userChatMessages = useMemo(() => {
    if (!chatId) return [];
    const chatMessagesData = chatMesages[chatId];

    if (!chatMessagesData) return [];

    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({ key, ...message });
    }

    return messageList.sort(
      (prev, next) => +new Date(next.sentAt) - +new Date(prev.sentAt)
    );
  }, [chatMesages]);

  const chatData =
    (chatId && storedChats[chatId]) || route?.params?.newChatData || null;

  useEffect(() => {
    if (!chatData) return;

    const otherUserId = chatData.users.find((uid) => uid !== userData!.userId);
    const otherUserData: IUserData = storedUsers[otherUserId!];
    const headerTitle =
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;

    navigation.setOptions({
      headerTitle: chatData?.chatName || headerTitle,
      headerRight: () => {
        return (
          <HeaderRight
            chatId={chatId}
            userData={userData!}
            onPressSettings={handlePressSettings}
            onPressDropdownMenu={handlePressDropdownMenu}
          />
        );
      },
    });
  }, [chatData?.users, userData?.chatImageBackground]);

  const handlePressSettings = () => {
    if (chatData?.isGroupChat) {
      navigation.navigate("ChatSettings", { chatId });
    } else {
      navigation.navigate("Contact", {
        uid: chatData?.users.find((uid) => uid !== userData!.userId)!,
        chatId,
      });
    }
  };

  const handlePressDropdownMenu = (source: number) => {
    uploadImageBackground(source);
    toggleMenu();
  };

  const sendMassage = useCallback(
    async (messageText: string) => {
      try {
        let id = chatId;
        if (!id) {
          id = (await createChat(userData!.userId, chatData!)) as string;
          setChatId(id);
        }

        const sendedData: ISendedData = {
          chatId: id,
          senderData: userData!,
          messageText: messageText,
          replyTo: replyingTo && replyingTo.key,
          chatUsers: chatData!.users,
        };

        await sendTextMessage(sendedData);

        setReplyingTo(null);
      } catch (error) {
        console.log(error);
        setErrorBannerText("Message faild to send.");
        setTimeout(() => {
          setErrorBannerText("");
        }, 3000);
      }
    },
    [chatId]
  );

  const pickImage = useCallback(async () => {
    try {
      await showImagePicker(
        { multiple: false, cropping: true },
        async (image: Image) => {
          if (image.path) {
            setTempImageUrl(image.path);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUrl]);

  const takePhoto = useCallback(async () => {
    try {
      await openCamera(
        { multiple: false, cropping: true },
        async (image: Image) => {
          if (image.path) {
            setTempImageUrl(image.path);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUrl]);

  const uploadImage = useCallback(
    async (imageDescription: string) => {
      try {
        setIsLoading(true);

        let id = chatId;
        if (!id) {
          id = (await createChat(userData!.userId, chatData!)) as string;
          setChatId(id);
        }

        const uploadUri = await uploadImageAsync(tempImageUrl, true);

        if (!uploadUri) {
          throw new Error("could not upload image");
        }

        const sendedData: ISendedData = {
          chatId: id,
          senderData: userData!,
          imageUrl: uploadUri,
          messageText: imageDescription,
          replyTo: replyingTo && replyingTo.key,
          chatUsers: chatData!.users,
        };

        await sendImage(sendedData);

        setIsLoading(false);
        setReplyingTo(null);
        setTempImageUrl("");
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setErrorBannerText("Message faild to send.");
        setTimeout(() => {
          setErrorBannerText("");
        }, 3000);
      }
    },
    [isLoading, tempImageUrl]
  );

  const uploadImageBackground = async (source: ImageSourcePropType) => {
    try {
      const newData = { chatImageBackground: source };

      await updateSignedInUserData(userData!.userId, newData);
      dispatch(updateLoggetInUserData({ newData }));
      // toggleMenu();
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = (itemData: ItemData) => {
    const message = itemData.item;
    const isOwnMessage = message.sentBy === userData?.userId;
    let messageType = isOwnMessage
      ? BubbleEnum.OwnMessage
      : BubbleEnum.NotOwnMessage;

    if (message.type) {
      messageType = BubbleEnum.Info;
    }

    const repliedTo = userChatMessages.find((i) => i.key === message.replyTo);
    const repliedToUser = repliedTo && storedUsers[repliedTo.sentBy];

    const sender = message.sentBy && storedUsers[message.sentBy];
    const name = sender && `${sender.firstName} ${sender.lastName}`;

    return (
      <Bubble
        type={messageType}
        text={message.text}
        messageId={message.key}
        userId={userData?.userId!}
        chatId={chatId}
        date={message.sentAt}
        name={!chatData?.isGroupChat || isOwnMessage ? undefined : name}
        setReply={() => {
          setReplyingTo(message);
        }}
        replyingTo={repliedTo}
        replyingToUser={repliedToUser}
        imageUrl={message.imageUrl}
        onPress={(uri: string) => {
          navigation.navigate("Image", {
            uri,
          });
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={120}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ImageBackground
          source={userData?.chatImageBackground ?? backgrounds.Droplet}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <ScreenContainer containerStyle={styles.screenContainer}>
            {!chatId && (
              <Bubble
                type={BubbleEnum.System}
                text={"This is a new chat. Say hi."}
              />
            )}
            {errorBannerText && (
              <Bubble type={BubbleEnum.Error} text={errorBannerText} />
            )}
            {chatId && (
              <FlatList
                contentContainerStyle={styles.listViewContainer}
                ref={(ref) => (flatList.current = ref)}
                // onContentSizeChange={() =>
                //   flatList.current.scrollToEnd({ animated: false })
                // }
                // onLayout={() =>
                //   flatList.current.scrollToEnd({ animated: false })
                // }
                onScroll={(event) => {
                  let currentOffset = event.nativeEvent.contentOffset.y;
                  offset < currentOffset
                    ? setIsShowFloatingButton(false)
                    : setIsShowFloatingButton(true);
                  setOffset(currentOffset);
                }}
                showsVerticalScrollIndicator={false}
                data={userChatMessages}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                inverted
              />
            )}
          </ScreenContainer>
          {isShowFloatingButton && offset > 0 && (
            <FloatingButton
              icon="arrow-down"
              onPress={() => {
                flatList.current.scrollToOffset({ offset: 0, animated: true });
              }}
            />
          )}
          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => {
                setReplyingTo(null);
              }}
            />
          )}
        </ImageBackground>
        <ChatInput
          onPickImage={pickImage}
          onSendMassage={sendMassage}
          onTakePhoto={takePhoto}
        />
        {tempImageUrl && (
          <SendImageModal
            isShowed={!!tempImageUrl}
            isLoading={isLoading}
            tempImageUrl={tempImageUrl}
            onCancel={() => {
              setTempImageUrl("");
            }}
            onConfirm={uploadImage}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    backgroundColor: "transparent",
  },
  listViewContainer: {
    minHeight: "100%",
    // justifyContent: "flex-end",
  },
  backgroundImage: {
    flex: 1,
  },
});

export default ChatScreen;
