import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import PageContainer from "../components/PageContainer";

const AuthScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
        <Text>AuthScreen</Text>
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
