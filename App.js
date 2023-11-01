import { SafeAreaView, BackHandler } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import  React, { useRef, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';


export default function App() {
  const [URL] = useState("https://creative-platform.netlify.app");
  const [isPortrait, setIsPortrait] = useState(true);
  const [statusBarStyle, setStatusBarStyle] = useState(true);
  const ref = useRef();
  const [navState, setNavState] = useState({canGoBack: false});

  useEffect(() => {
    const onPress = () => {
      if (navState.canGoBack) {
        // 뒤로 갈 수 있는 상태라면 이전 웹페이지로 이동한다
        ref.current.goBack();
        // 기본 뒤로가기 동작을 수행하지 않을 거라면 true 를 리턴한다.
        return true;
      } else {
        // 뒤로 갈 수 없는 상태라면
        // 다른 원하는 행동을 하면 된다
        console.log("do something");
        // 기본 뒤로가기 동작을 수행하지 않을 거라면 true 가 아닌 값을 리턴한다.
        return false;
      }
    };

    // 안드로이드 백버튼이 눌렸을 때 이벤트 리스너를 등록한다.
    BackHandler.addEventListener("hardwareBackPress", onPress);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onPress);
    };
  }, [navState.canGoBack]);


  const changeOrientation = async (portrait) => {
    if (portrait) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
  }
  const onNavigationStateChange = (webViewState) => {
    setNavState(webViewState);
    if (webViewState.url.includes('/community')) {
      changeOrientation(true);
      setIsPortrait(true);
      setStatusBarStyle(false);
    } else if (webViewState.url.includes('/login') || webViewState.url.includes('/create-account')) {
      changeOrientation(true);
      setIsPortrait(true);
      setStatusBarStyle(false);
    } else {
      changeOrientation(false);
      setIsPortrait(false);
      setStatusBarStyle(true);
    }
  };

  useEffect(()=>{
    changeOrientation(false);
  },[])
  return (
    <>
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: Platform.OS === 'ios' ? 0 : isPortrait ? 20 : 0}}>
          <StatusBar style='auto' hidden={statusBarStyle} />
          <WebView
            source={{ uri: URL}}
            onNavigationStateChange={onNavigationStateChange}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}   
            ref={ref}
          />
        </SafeAreaView>
    </>
  );
}
