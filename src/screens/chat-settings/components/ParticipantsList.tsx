import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DataItem } from "../../../shared/components";
import colors from "../../../shared/constants/colors";
import {
  DataItemTypeEnum,
  IChatData,
  IUsers,
} from "../../../shared/types/types";

interface ParticipantsListProps {
  chatData: IChatData;
  loggedInUserId: string;
  storedUsers: IUsers;
  onPressAddUsers: () => void;
  onPressItem: (uid: string) => void;
  onPressViewAll: () => void;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  chatData,
  storedUsers,
  loggedInUserId,
  onPressAddUsers,
  onPressItem,
  onPressViewAll,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.heading}>{chatData.users.length} Participants</Text>
      <DataItem
        title="Add users"
        icon="person-add-outline"
        type={DataItemTypeEnum.Button}
        onPress={onPressAddUsers}
      />
      {chatData.users.slice(0, 3).map((uid) => {
        const currentUser = storedUsers[uid];
        return (
          <DataItem
            key={uid}
            image={currentUser.profilePicture}
            title={`${currentUser.firstName} ${currentUser.lastName}`}
            subTitle={currentUser.about}
            type={uid !== loggedInUserId ? DataItemTypeEnum.Link : undefined}
            onPress={() => {
              onPressItem(uid);
            }}
          />
        );
      })}
      {chatData.users.length > 3 && (
        <DataItem
          type={DataItemTypeEnum.Link}
          title="View all"
          hideImage
          onPress={onPressViewAll}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: "100%",
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: "Alkatra-Medium",
    letterSpacing: 0.3,
  },
});

export default ParticipantsList;
