import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { ChatScreenNavigationProps } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import colors from "../constants/colors";
import ScreenContainer from "../components/ScreenContainer";
import commonStyles from "../constants/commonStyles";
import { searchUsers } from "../utils/actions/userActions";
import UserDataItem from "../components/UserDataItem";
import { IUsers } from "../types/types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setStoredUsers } from "../store/userSlice";

const NewChatScreen = () => {
  const navigation = useNavigation<ChatScreenNavigationProps>();

  const authorizedUserData = useAppSelector((state) => state.auth.userData);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<IUsers | null>(null);
  const [isNoResultFound, setIsNoResultFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item title="Close" onPress={() => navigation.goBack()} />
          </HeaderButtons>
        );
      },
      headerTitle: "New Chat",
    });
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers(null);
        setIsNoResultFound(false);
        return;
      }

      setIsLoading(true);

      const usersResult = await searchUsers(searchTerm);
      delete usersResult[authorizedUserData?.userId!];
      setUsers(usersResult);

      if (!Object.keys(usersResult).length) {
        setIsNoResultFound(true);
      } else {
        setIsNoResultFound(false);

        dispatch(setStoredUsers({ newUsers: usersResult }));
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const userPressed = (userId: string) => {
    navigation.navigate("ChatList", {
      selectedUserId: userId,
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={15} color={colors.lightGrey} />
        <TextInput
          placeholder="Search"
          style={styles.searchBox}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {isLoading && (
        <View style={commonStyles.center}>
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      )}

      {!isLoading && !isNoResultFound && users && (
        <FlatList
          data={Object.keys(users)}
          keyExtractor={(item) => item}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];
            return (
              <UserDataItem
                userData={userData}
                onPress={() => {
                  userPressed(userId);
                }}
              />
            );
          }}
        />
      )}

      {!isLoading && isNoResultFound && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="question"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultText}>No users found!</Text>
        </View>
      )}

      {!isLoading && !users && (
        <View style={commonStyles.center}>
          <FontAwesome
            name="users"
            size={55}
            color={colors.lightGrey}
            style={styles.noResultIcon}
          />
          <Text style={styles.noResultText}>
            Enter a name to search for a user!
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    height: 36,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLightGrey,
    borderRadius: 4,
  },
  searchBox: {
    padding: 0,
    marginLeft: 8,
    fontSize: 16,
    width: "100%",
  },
  noResultIcon: {
    marginBottom: 20,
  },
  noResultText: {
    color: colors.textColor,
    fontFamily: "Alkatra-Regular",
    letterSpacing: 0.3,
  },
});

export default NewChatScreen;
