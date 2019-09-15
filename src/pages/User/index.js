import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Loading,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    currentPage: 1,
    loading: true,
    refreshingList: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { currentPage } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      loading: false,
      currentPage: currentPage + 1,
    });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const { currentPage, stars } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(
      `/users/${user.login}/starred?page=${currentPage}`
    );

    this.setState({
      stars: stars.concat(response.data),
      currentPage: currentPage + 1,
    });
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const { currentPage } = this.state;
    const user = navigation.getParam('user');

    this.setState({ refreshingList: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      currentPage: currentPage + 1,
      refreshingList: false,
    });
  };

  render() {
    const { stars, loading, refreshingList } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <Stars
            onEndReachedThreshold={0.3}
            onEndReached={this.loadMore}
            refreshing={refreshingList}
            onRefresh={this.refreshList}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
