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

import { RootScreenNavigationProps } from "../navigation/types";
import CustomHeaderButton from "../components/CustomHeaderButton";
import colors from "../constants/colors";
import ScreenContainer from "../components/ScreenContainer";
import commonStyles from "../constants/commonStyles";
import { searchUsers } from "../utils/actions/userActions";
import UserDataItem from "../components/UserDataItem";
import { IUserData } from "../types/types";

interface IUsers {
  [key: string]: IUserData;
}

const NewChatScreen = () => {
  const navigation = useNavigation<RootScreenNavigationProps>();

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

      const userResult = await searchUsers(searchTerm);
      setUsers(userResult);

      if (!Object.keys(userResult).length) {
        setIsNoResultFound(true);
      } else {
        setIsNoResultFound(false);
      }

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

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
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];
            console.log(userData);
            return <UserDataItem userData={userData} />;
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
    height: 30,
    marginVertical: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.extraLightGrey,
    borderRadius: 4,
  },
  searchBox: {
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
