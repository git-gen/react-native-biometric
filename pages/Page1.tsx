import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Platform,
  NativeModules,
} from 'react-native';
import TouchID from 'react-native-touch-id';

interface stateType {
  id: string,
  password: string,
  localId: string,
  localPassword: string,
  apiLevel: string,
  authState: string,
}

class Page1 extends React.Component<stateType> {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      password: '',
      localId: '',
      localPassword: '',
      apiLevel: '',
      authState: '',
    };
  }

  componentWillMount = () => {
    // Androidの場合APIレベルを取得する
    if (Platform.OS === 'android') {
      const AndroidModule = NativeModules.AndroidModule;
      AndroidModule.getApiLevel((level) => {
        this.setState({ apiLevel: `${level}` });
      });
      AndroidModule.getAuthState((state) => {
        this.setState({ authState: `${state}` });
      });
    }
  }

  authentication = (platformOS) => {
    if (platformOS === 'android') {
      // Androidの生体認証
      if (this.state.apiLevel >= 22) {
        // biometric
        switch (this.state.authState) {
          case "BIOMETRIC_SUCCESS":
            this.biometricAuthentication();
            break;
          case "BIOMETRIC_ERROR_NO_HARDWARE":
            Alert.alert("端末に生体認証機能がありません");
            break;
          case "BIOMETRIC_ERROR_HW_UNAVAILABLE":
            Alert.alert("生体認証機能が利用できません");
            break;
          case "BIOMETRIC_ERROR_NONE_ENROLLED":
            Alert.alert("認証データが登録されていません");
            break;
          default:
            Alert.alert("認証に失敗しました");
            break;
        }
      } else {
        // fingerprint
        TouchID.authenticate('指紋認証を行ってください', {
          title: '生体認証実行',
          imageColor: '#008080',
          imageErrorColor: 'red',
          sensorErrorDescription: '認証に失敗しました',
          cancelText: 'キャンセル'
        })
          .then(success => {
            this.props.navigation.navigate('Page2')
          })
          .catch(error => {
            console.log({ error });
          });
      }
    } else {
      // iOSの生体認証
      TouchID.authenticate('生体認証実行')
        .then(success => {
          this.props.navigation.navigate('Page2')
        })
        .catch(error => {
          console.log({ error });
        });
    }
  }

  biometricAuthentication = () => {
    const AndroidModule = NativeModules.AndroidModule;
    AndroidModule.biometric((result) => {
      switch (`${result}`) {
        case "BIOMETRIC_SUCCEEDED":
          this.props.navigation.navigate('Page2');
          break;
        case "BIOMETRIC_FAILED":
          Alert.alert("認証に失敗しました");
          break;
        case "BIOMETRIC_ERROR":
          Alert.alert("エラーが発生しました");
          break;
        default:
          Alert.alert("認証に失敗しました");
          break;
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.apiLevel}>
          <Text>API Level: {this.state.apiLevel}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>Page1</Text>
        </View>
        <TouchableOpacity
          style={styles.transition}
          onPress={() => this.authentication(Platform.OS)}
        >
          <Text style={styles.transitionText}>生体認証実行</Text>
        </TouchableOpacity>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 80,
  },
  transition: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transitionText: {
    paddingVertical: 40,
    fontSize: 30,
  },
});

export default Page1
