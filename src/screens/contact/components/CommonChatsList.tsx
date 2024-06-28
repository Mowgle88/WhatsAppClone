import React from "react";
import { StyleSheet, Text } from "react-native";
import { DataItem } from "../../../shared/components";
import colors from "../../../shared/constants/colors";
import {
  DataItemTypeEnum,
  IChatData,
  IObjectData,
} from "../../../shared/types/types";

interface CommonChatsListProps {
  commonChats: string[];
  storedChats: IObjectData<IChatData>;
  onPress: (id: string) => void;
}

const CommonChatsList: React.FC<CommonChatsListProps> = ({
  commonChats,
  storedChats,
  onPress,
}) => {
  return (
    <>
      <Text style={styles.heading}>
        {commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"} in
        common
      </Text>
      {commonChats.map((cid, index) => {
        const chatData = storedChats[cid];

        return (
          <DataItem
            key={`${chatData?.key}-${index}`}
            title={chatData?.chatName!}
            subTitle={chatData?.latestMessageText!}
            image={chatData?.chatImage!}
            type={DataItemTypeEnum.Link}
            onPress={() => {
              onPress(cid);
            }}
          />
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Alkatra-Bold",
    letterSpacing: 0.3,
    color: colors.textColor,
    marginVertical: 8,
  },
});

export default CommonChatsList;
