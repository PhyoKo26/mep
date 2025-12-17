import { Platform, StyleSheet } from 'react-native';

const shadowStyle = StyleSheet.create({
  appBar: {
    backgroundColor: '#fff',
    shadowColor: Platform.OS == 'ios' ? '#02107D' : '#02107D',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 15,
    // position: 'absolute',
    // marginHorizontal: 12,
    // bottom: 0,
    width: '100%'
  },

  appBarIcon: {
    shadowColor: Platform.OS == 'ios' ? '#02107D' : '#02107D',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.37,
    shadowRadius: 3.49,
    elevation: 12,
  },
});

export default shadowStyle;
