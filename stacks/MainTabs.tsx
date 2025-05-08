import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";

// 하단 Tab을 위한 RabNavigator 생성
const Tab = createBottomTabNavigator();

export default () => {
  // TabNavigator 로 내가 원하는 하단 Tab을 감싸준다.
  return (
    <Tab.Navigator>
      {/*1번쨰 Main Tab */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      {/* 2번째 Tab*/}
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
