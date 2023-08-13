import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import RN, {
  ImageBackground,
  StyleSheet,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "react-native-image-crop-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../constants/colors";
import ScreenContainer from "../components/ScreenContainer";
import Bubble from "../components/Bubble";
import ReplyTo from "../components/ReplyTo";
import {
  ChatScreenRouteProp,
  RootScreenNavigationProps,
} from "../navigation/types";
import {
  BubbleEnum,
  IChatMessagesData,
  ISendedData,
  IUserData,
} from "../types/types";
import { useAppSelector } from "../store/hooks";
import {
  createChat,
  sendImage,
  sendTextMessage,
} from "../utils/actions/chatActions";
import {
  openCamera,
  showImagePicker,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();
  const route = useRoute<ChatScreenRouteProp>();

  const flatList = useRef<any>();

  const userData = useAppSelector((state) => state.auth.userData);
  const storedUsers = useAppSelector((state) => state.users.storedUsers);
  const storedChats = useAppSelector((state) => state.chats.chatsData);
  const chatMesages = useAppSelector((state) => state.messages.messagesData);

  const [messageText, setMessageText] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [chatId, setChatId] = useState(route?.params?.chatId ?? "");
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<IChatMessagesData | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userChatMessages = useMemo(() => {
    if (!chatId) return [];
    const chatMessagesData = chatMesages[chatId];

    if (!chatMessagesData) return [];

    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({ key, ...message });
    }
    return messageList;
  }, [chatMesages]);

  const chatData =
    (chatId && storedChats[chatId]) || route?.params?.newChatData;

  useEffect(() => {
    const otherUserId = chatData?.users.find((uid) => uid !== userData!.userId);
    const otherUserData: IUserData = storedUsers[`${otherUserId}`];
    const headerTitle =
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;

    navigation.setOptions({
      headerTitle: chatData?.chatName ?? headerTitle,
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {chatId && (
              <Item
                title="Chat settings"
                iconName="settings-outline"
                color={colors.textColor}
                onPress={() =>
                  chatData?.isGroupChat
                    ? navigation.navigate("ChatSettings", { chatId })
                    : navigation.navigate("Contact", {
                        uid: chatData?.users.find(
                          (uid) => uid !== userData!.userId
                        )!,
                      })
                }
              />
            )}
          </HeaderButtons>
        );
      },
    });
  }, [chatData?.chatName]);

  const sendMassage = useCallback(async () => {
    try {
      let id = chatId;
      if (!id) {
        id = (await createChat(userData!.userId, chatData!)) as string;
        setChatId(id);
      }

      const sendedData: ISendedData = {
        chatId: id,
        senderId: userData!.userId,
        messageText: messageText,
        replyTo: replyingTo && replyingTo.key,
      };

      await sendTextMessage(sendedData);

      setMessageText("");
      setReplyingTo(null);
    } catch (error) {
      console.log(error);
      setErrorBannerText("Message faild to send.");
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  }, [messageText, chatId]);

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

  const uploadImage = useCallback(async () => {
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
        senderId: userData!.userId,
        imageUrl: uploadUri,
        messageText: imageDescription,
        replyTo: replyingTo && replyingTo.key,
      };

      await sendImage(sendedData);

      setIsLoading(false);
      setReplyingTo(null);
      setImageDescription("");
      setTempImageUrl("");
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrorBannerText("Message faild to send.");
      setTimeout(() => {
        setErrorBannerText("");
      }, 3000);
    }
  }, [isLoading, tempImageUrl, imageDescription]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={120}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ImageBackground
          source={require("../assets/images/droplet.jpeg")}
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
                onContentSizeChange={() =>
                  flatList.current.scrollToEnd({ animated: false })
                }
                onLayout={() =>
                  flatList.current.scrollToEnd({ animated: false })
                }
                showsVerticalScrollIndicator={false}
                data={userChatMessages}
                keyExtractor={(item) => item.key}
                renderItem={(itemData) => {
                  const message = itemData.item;
                  const isOwnMessage = message.sentBy === userData?.userId;
                  const messageType = isOwnMessage
                    ? BubbleEnum.OwnMessage
                    : BubbleEnum.NotOwnMessage;

                  const repliedTo = userChatMessages.find(
                    (i) => i.key === message.replyTo
                  );
                  const repliedToUser =
                    repliedTo && storedUsers[repliedTo.sentBy];

                  const sender = message.sentBy && storedUsers[message.sentBy];
                  const name =
                    sender && `${sender.firstName} ${sender.lastName}`;

                  return (
                    <Bubble
                      type={messageType}
                      text={message.text}
                      messageId={message.key}
                      userId={userData?.userId!}
                      chatId={chatId}
                      date={message.sentAt}
                      name={
                        !chatData?.isGroupChat || isOwnMessage
                          ? undefined
                          : name
                      }
                      setReply={() => {
                        setReplyingTo(message);
                      }}
                      replyingTo={repliedTo}
                      replyingToUser={repliedToUser}
                      imageUrl={message.imageUrl}
                    />
                  );
                }}
              />
            )}
          </ScreenContainer>
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
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Icon name="add-outline" size={24} color={colors.blue} />
          </TouchableOpacity>
          <TextInput
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMassage}
            style={styles.input}
          />
          {messageText && (
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={sendMassage}
            >
              <Icon name="send-sharp" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          {!messageText && (
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Icon name="camera-outline" size={24} color={colors.blue} />
            </TouchableOpacity>
          )}
          {tempImageUrl && (
            <AwesomeAlert
              show={!!tempImageUrl}
              title="Send image"
              closeOnTouchOutside={true}
              closeOnHardwareBackPress={false}
              showCancelButton={true}
              showConfirmButton={true}
              cancelText="Cancel"
              confirmText="Send image"
              confirmButtonColor={colors.primary}
              cancelButtonColor={colors.red}
              titleStyle={styles.popupTitle}
              onCancelPressed={() => {
                setTempImageUrl("");
              }}
              onConfirmPressed={uploadImage}
              onDismiss={() => {
                setTempImageUrl("");
              }}
              customView={
                <View>
                  {isLoading && (
                    <ActivityIndicator size="large" color={colors.primary} />
                  )}
                  {!isLoading && tempImageUrl && (
                    <>
                      <RN.Image
                        source={{ uri: tempImageUrl }}
                        style={styles.image}
                      />
                      <TextInput
                        placeholder="add a description"
                        value={imageDescription}
                        onChangeText={(text) => setImageDescription(text)}
                        style={styles.imageInput}
                      />
                    </>
                  )}
                </View>
              }
            />
          )}
        </View>
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
    justifyContent: "flex-end",
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  button: {
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    paddingLeft: 4,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 16,
    paddingHorizontal: 12,
  },
  popupTitle: {
    fontFamily: "Alkatra-Medium",
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  image: {
    width: 200,
    height: 200,
  },
  imageInput: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    paddingVertical: Platform.OS === "android" ? 0 : 4,
    marginTop: 16,
    paddingHorizontal: 12,
  },
});

export default ChatScreen;
