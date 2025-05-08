import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, Image } from "react-native";
import styled from "styled-components";
import { MainStackScreenList } from "../stacks/MainStack";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

const Container = styled(View)``;
const Title = styled(Text)``;

const UploadBox = styled(View)`
  flex-direction: row;
  background-color: tomato;
`;
const Caption = styled(View)`
  flex: 1;
  background-color: yellowgreen;
`;
const Input = styled(TextInput)``;

const PhotoBox = styled(View)`
  width: 150px;
  height: 150px;
`;

const Photo = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
`;
const PhotoBlack = styled(View)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: black;
  opacity: 0.3;
  position: absolute;
`;

// route.params -> useNavigation 에서 전달받은 데이터가 들어있음
export default ({
  route: { params },
}: NativeStackScreenProps<MainStackScreenList, "UploadPost">) => {
  // params.assets안 값이 null 이라면 [] 빈배열을 할당한다.
  const assets = params.assets === null ? [] : params.assets;

  return (
    <Container>
      <Title>Upload Post Paget</Title>
      <UploadBox>
        {/*선택한 사진 보여주는 영역*/}
        <PhotoBox>
          <Photo source={{ uri: assets[0].uri }} />
          <PhotoBlack />
          <AntDesign
            style={{ position: "absolute", right: 0, margin: 7 }}
            name="switcher"
            size={25}
            color={"white"}
          />
        </PhotoBox>
        {/*글 작성하는 영역*/}
        <Caption>
          <Input />
        </Caption>
      </UploadBox>
    </Container>
  );
};
