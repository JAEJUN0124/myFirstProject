import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackScreenList } from "../stacks/MainStack";

export default function Home() {
  // 0.InitiaIized
  // Hook : navigation 기능을 사용하기 위한 Hook
  const navi = useNavigation<NativeStackNavigationProp<MainStackScreenList>>();

  // A.Logic Process
  const goToPage = () => {
    //Alert.alert("페이지 이동!");
    navi.navigate("CreatePost");
  };

  // B.Page UI Rendering
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>InstaDaelim</Text>
        <Button onPress={goToPage} title={"CREATE"}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "tomato",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});
