import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import PageContainer from "../components/PageContainer";
import Input from "../components/Input";

const AuthScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
        <Input label="First Name" icon="person-outline" IconPack={IonIcon} />
        <Input label="Last Name" icon="person-outline" IconPack={IonIcon} />
        <Input label="Email" icon="mail-outline" IconPack={IonIcon} />
        <Input label="Password" icon="lock-closed-outline" IconPack={IonIcon} />
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthScreen;
