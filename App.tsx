import { NavigationContainer } from "@react-navigation/native";
import MainStack from "./stacks/MainStack";

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}
