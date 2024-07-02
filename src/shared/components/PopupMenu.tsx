import React, { ForwardedRef, forwardRef } from "react";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import Clipboard from "@react-native-clipboard/clipboard";
import { MenuItem } from "#ui";
import { starMessage } from "#utils";

interface PopupMenuProps {
  id: string;
  setReply: () => void;
  isStarred: boolean;
  text: string;
  messageId: string;
  chatId: string;
  userId: string;
}

const PopupMenu = forwardRef<any, PopupMenuProps>(
  (
    { setReply, isStarred, text, messageId, chatId, userId, id },
    ref: ForwardedRef<Menu>
  ) => {
    const copyToClipboard = async (copiedText: string) => {
      Clipboard.setString(copiedText);
    };

    return (
      <Menu name={id} ref={ref}>
        <MenuTrigger />
        <MenuOptions>
          <MenuItem
            text="Copy to Clipboard"
            icon="copy-outline"
            onSelect={() => copyToClipboard(text)}
          />
          <MenuItem
            text={`${isStarred ? "Unstar" : "Star"} message`}
            icon={isStarred ? "star-outline" : "star"}
            onSelect={() => starMessage(messageId!, chatId!, userId!)}
          />
          <MenuItem
            text="Reply"
            icon="arrow-undo-outline"
            onSelect={setReply!}
          />
        </MenuOptions>
      </Menu>
    );
  }
);

export default PopupMenu;
