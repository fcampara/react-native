import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  Title,
  Author,
  OwnerAvatar,
  Info,
} from './styles'
import api from '../../services/api'

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  })

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  }

  state = {
    stars: [],
  }

  async componentDidMount() {
    const { navigation } = this.props
    const user = navigation.getParam('user')

    await api.get(`/users/${user.login}/starred`).then(({ data }) => {
      this.setState({ stars: data })
    })
  }

  render() {
    const { navigation } = this.props
    const { stars } = this.state

    const user = navigation.getParam('user')
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatarUrl }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
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
      </Container>
    )
  }
}
