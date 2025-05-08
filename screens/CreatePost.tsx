import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  FlatListComponent,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { styled } from "styled-components";
import LoadingScreen from "./LoadingScreen";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackScreenList, NaviProps } from "../stacks/MainStack";

const Container = styled(View)`
  flex: 1;
`;
const PageTitle = styled(Text)`
  font-size: 60px;
  text-align: center;
`;

// My Gallery Photo styled-component
const PhotoBtn = styled(TouchableOpacity)`
  width: 100px;
  height: 100px;
`;
const PhotoImg = styled(Image)`
  width: 100%;
  height: 100%;
`;
// Selected Photo
const SelectedPhoto = styled(View)`
  width: 200px;
  height: 200px;
`;
const SelectedPhotoImg = styled(Image)`
  width: 100%;
  height: 100%;
`;
// Select Icon
const InnerCircle = styled(View)`
  width: 25px;
  height: 25px;
  background-color: yellow;
  position: absolute;
  border-radius: 50%;
  margin: 5px;
  right: 0px;
`;
const SelectIcon = styled(Image)`
  width: 100%;
  height: 100%;
`;
const AlbumMenuTitle = styled(Text)`
  font-weight: 600;
  font-size: 25px;
  color: black;
  margin: 15px 20px;
`;

const NextHeaderBtn = styled(TouchableOpacity)`
  padding: 5px 15px;
`;
const NextHeaderTitle = styled(Text)`
  font-size: 18px;
  font-weight: 600;
  color: dodgerblue;
`;

// 한 줄에 띄울 갤러리 사진 수
const numColumns = 3;

export default () => {
  // state는 useState라는 Hook을 이용해 만듬
  // A: Loading (로딩 여부)
  const [loading, setLoading] = useState<Boolean>(true);
  // B: 갤러리에서 불러온 사진들
  const [myPhotos, setMyPhotos] = useState<DummyDataType[]>([]);
  // C: 불러온 사진 중에서 선택한 사진들
  const [selectedPhotos, setSelectedPhotos] = useState<DummyDataType[]>([]);
  // Hook: 스마트폰 화면의 넓이를 가져오는 기능
  const { width: WIDTH } = useWindowDimensions();
  // Hook : Page 이동을 하기 위한  Navigation Hook
  const navi = useNavigation<NaviProps>();

  // 갤러리 사진 사이즈 (FlatList)
  const itemSize = WIDTH / numColumns;

  // Selected Photo Size(in ScrollView)
  const photoSize = WIDTH * 0.75;
  const photoPadding = (WIDTH - photoSize) / 2;

  // 내가 선택한 사진인지 아닌지 확인
  const isSelect = (photo: DummyDataType): boolean => {
    const findPhotoIndex = selectedPhotos.findIndex(
      (asset) => asset.id === photo.id
    );
    // findPhoto: 0보다 작으면 내가 선택하지 않음 -> false
    // findPhoto: 0이거나 0보다 크면 내가 선택함 -> true
    return findPhotoIndex < 0 ? false : true;
  };

  // 불러온 사진 선택하기
  const onSelectedPhoto = (photo: DummyDataType) => {
    // 1. 선택한 사진인지 아닌지 확인 -> photo가 selectedPhotos 안에 존재하는지 확인
    const findPhotoIndex = selectedPhotos.findIndex(
      (asset) => asset.id === photo.id
    );

    // A. 한번도 선택하지 않은 사진 -> 선택한 사진 리스트(selectedPhotos)에 추가
    if (findPhotoIndex < 0) {
      const newPhotos = [...selectedPhotos, photo];
      setSelectedPhotos(newPhotos);
    }
    // B. 이미 선택했던 사진 -> 선택한 사진 리스트(selectedPhotos)에서 삭제
    else {
      // 1. 지우고 싶은 사진의 index 번호 알아오기 -> findPhotoIndex
      // 2. 선택 사진 리스트에서 해당 index 번호의 사진(item) 지우기
      const removedPhotos = selectedPhotos.concat();
      const deleteCount = 1;
      removedPhotos.splice(findPhotoIndex, deleteCount);
      // 3. 해당 사진이 지워진 새로운 선택사진 리스트를 갱신(update)
      setSelectedPhotos(removedPhotos);
    }
  };

  // 갤러리에서 사진 불러오기 (비동기처리)
  const getMyPhotos = async () => {
    // 1. 사진첩 접근 권한 요청
    const { status } = await MediaLibrary.requestPermissionsAsync();
    // [방어코드] : 만약 접근 권한을 거절한 경우 -> 접근 권한을 변경할수 있도록 설정창으로 이동 -> 함수 종료
    if (status === MediaLibrary.PermissionStatus.DENIED) {
      Alert.alert(
        "사진 접근권한",
        "기능을 사용하시려면 사진 접근권한을 허용해주세요.",
        [
          {
            onPress: async () => {
              await Linking.openSettings;
            },
          },
        ]
      );
      return;
    }
    // 2. (접근을 수락한 경우) 사진첩에서 사진들 불러오기
    const { assets } = await MediaLibrary.getAssetsAsync();
    // 3. 불러온 사진들은 myPhotos State에 저장
    setMyPhotos(dummyPhotoDatas);
    // Final: 로딩 종료
    setLoading(false);
  };

  // 현재 페이지 접속 시 1번 실행되는 Hook
  useEffect(() => {
    // 3초 후에 getMyPhotos 실행
    setTimeout(() => {
      getMyPhotos();
    }, 500);
  }, []);

  // Header 의 style을 변경하기 위해 사용하는 Hook
  useLayoutEffect(() => {
    // 페이지 이동을 위한 함수 + 데이터 전달
    // [*문제 발생] : 페이지 생성 시, 비어있는 selectPhotos를 1번 집어넣고,
    //                끝나기 깨문에 나중에 사진을 선택하더라도 goTo-selectedPhotos 값이
    //                갱신이 되지 않는다... -> 의존배열성 [selectedPhotos] 넣어서
    //                selectedPhotos 안의 값, 사진을 선택할때마다 useEffect 가 새로 실행되어서
    //                갱신되로록 코드를 수정한다.
    const goTo = () => {
      // 선택한 사진이 없으면 이동하지 않고, 알림!
      if (selectedPhotos.length < 1) {
        Alert.alert("알림", "선택하신 사진이 없습니다. 사진을 선택해주세요");
        return;
      }
      // 페이지 이동
      navi.navigate("UploadPost", {
        assets: selectedPhotos,
      });
    };
    // navigigionHook 을 사용해 Header 접근
    navi.setOptions({
      headerRight: () => (
        <NextHeaderBtn onPress={goTo}>
          <NextHeaderTitle>Next</NextHeaderTitle>
        </NextHeaderBtn>
      ),
    });
  }, [selectedPhotos]);

  // Page UI Rendering
  return loading ? (
    <LoadingScreen />
  ) : (
    <Container>
      {/*A. 내가 선택할 사진들을 보여줄 가로 ScrollView */}
      <ScrollView
        horizontal={true}
        style={{ width: WIDTH, height: WIDTH }}
        contentContainerStyle={{
          paddingHorizontal: photoPadding,
          alignItems: "center",
          gap: 10,
        }}
        snapToInterval={photoSize + 10}
        decelerationRate={"fast"}
        showsHorizontalScrollIndicator={false}
      >
        {/* map: selectedPhotos가 가지고 있는 데이터만큼 반복 */}
        {selectedPhotos.map((photo, index) => {
          return (
            <SelectedPhoto
              key={index}
              style={{ width: photoSize, height: photoSize }}
            >
              <SelectedPhotoImg source={{ uri: photo.uri }} />
            </SelectedPhoto>
          );
        })}
      </ScrollView>
      <AlbumMenuTitle>최근 순▽</AlbumMenuTitle>
      {/*B. 내 갤러리의 사진들을 보여줄 세로 FlatList */}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns} /* 한줄에 띄울 아이템 수 */
        data={myPhotos} /* 스크롤할 데이터 */
        // 데이터를 어떻게 보여줄지 정함
        renderItem={({ item }) => {
          return (
            <PhotoBtn
              onPress={() => {
                onSelectedPhoto(item);
              }}
              style={{ width: itemSize, height: itemSize }}
            >
              <PhotoImg source={{ uri: item.uri }} />
              {isSelect(item) && (
                <InnerCircle>
                  <FontAwesome name="check" size={24} color="black" />
                </InnerCircle>
              )}
            </PhotoBtn>
          );
        }}
      />
    </Container>
  );
};

// legacy css
const styles = StyleSheet.create({
  container: {
    backgroundColor: "tomato",
  },
});

// 더미데이터의 타입만들기 -1
export type DummyDataType = {
  id: string;
  uri: string;
};

// [Type] => Union (값을 제한)
type AlignItemsType = "center" | "flex-end" | "flex-start";

// 더미데이터의 타입만들기 -2
interface IDummyData {
  id: string;
  uri: string;
}

// DummyData(가짜데이터)
const dummyPhotoDatas: IDummyData[] = [
  {
    id: "1",
    uri: "https://www.hotelrestaurant.co.kr/data/photos/20220728/art_16577731145778_5e2ed7.jpg",
  },
  {
    id: "2",
    uri: "https://newsimg.sedaily.com/2020/06/12/1Z3ZZOKI8W_1.jpg",
  },
  {
    id: "3",
    uri: "https://dimg.donga.com/wps/NEWS/IMAGE/2019/11/21/98468347.2.jpg",
  },
  {
    id: "4",
    uri: "https://content.presspage.com/uploads/685/1920_2022sustainabletravelreport10-2.jpg?10000",
  },
  {
    id: "5",
    uri: "https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/47uI/image/uuie0S1uykMpnLJuIKndh3vwyIY.jpg",
  },
  {
    id: "6",
    uri: "https://cdn.discoverynews.kr/news/photo/202307/1030520_1046396_3112.jpg",
  },
  {
    id: "7",
    uri: "https://www.chosun.com/resizer/v2/FBJPYRHHBJO4BHFHBYK6HB4RYU.jpg?auth=6e180dff7b950c2fcbb3ec302fb0b8a50ac69ae7bf818ddd453d8aa6ae19a496&width=616",
  },
  {
    id: "8",
    uri: "https://blog.kakaocdn.net/dn/c1wQP4/btsJBNDpQ6k/7wveRqPWeGSPenqsdm4hOk/img.jpg",
  },
  {
    id: "9",
    uri: "https://cdn.pressian.com/_resources/10/2021/06/09/2021060911533184690_l.jpg",
  },
];
