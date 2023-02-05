import { StyleSheet, Text, StatusBar, Button, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {

  const pressHandler = () => {
    Alert.alert("WhatsAppClone")
  }
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
        <StatusBar
          barStyle="default"
          backgroundColor="#3498db"
        />
        <Text style={styles.label}>WhatsAppClone!!!</Text>
        <Button title="Click me" onPress={pressHandler} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: 'white',
    fontSize: 18
  }
});