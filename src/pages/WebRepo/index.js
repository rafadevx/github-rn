import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

// import { Container } from './styles';

export default function WebRepo({ navigation }) {
  return (
    <WebView
      source={{ uri: navigation.getParam('repo').html_url }}
      style={{ flex: 1 }}
    />
  );
}

WebRepo.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repo').name,
});

WebRepo.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
