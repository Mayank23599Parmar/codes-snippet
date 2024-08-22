
import React, { useRef, useEffect, useState } from 'react';
import { BackHandler, Alert } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { WebView } from 'react-native-webview';


function App(): React.JSX.Element {
   const webviewRef = useRef(null);
   const [canGoBack, setCanGoBack] = useState(false);
 useEffect(()=>{
SplashScreen.hide()
 },[])
   useEffect(() => {
     const handleBackButton = () => {
       if (canGoBack) {
         webviewRef.current.goBack();
         return true;
       } else {
         Alert.alert(
           'Exit App',
           'Do you want to exit?',
           [
             {
               text: 'No',
               onPress: () => null,
               style: 'cancel',
             },
             {
               text: 'Yes',
               onPress: () => BackHandler.exitApp(),
             },
           ],
           { cancelable: false }
         );
         return true;
       }
     };
 
     BackHandler.addEventListener('hardwareBackPress', handleBackButton);
 
     return () => {
       BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
     };
   }, [canGoBack]);
   const onNavigationStateChange = (navState) => {
      setCanGoBack(navState.canGoBack);
    };
  
  return (

     <WebView source={{ uri: 'URL' }} style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onNavigationStateChange={onNavigationStateChange}
        ref={webviewRef}
     />
  );
}
export default App;
