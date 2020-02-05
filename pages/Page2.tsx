import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

interface propsType {
  navigation: any;
}

class Page2 extends React.Component<propsType> {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Page2</Text>
        </View>
        <TouchableOpacity
          style={styles.transition}
          onPress={() => this.props.navigation.navigate('Page1')}
        >
          <Text style={styles.transitionText}>Page1へ遷移</Text>
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
    paddingVertical: 30,
    fontSize: 30,
  },
});

export default Page2
