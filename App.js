import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from 'react-native';
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from './Screens/Home';
import Login from './Screens/Login';
import Orders from "./Screens/Orders";
import { socket, backendSocket, SocketContext } from "./context/actions/socket";

const Stack = createNativeStackNavigator();
export default function App() {

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SocketContext.Provider value={{ socket, backendSocket }}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={"Orders"}
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Orders" component={Orders} />

              </Stack.Navigator>
            </NavigationContainer>
          </SocketContext.Provider>
        </GestureHandlerRootView>
      </PersistGate>

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
