import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Keyboard, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'

import {
  Container,
  Form,
  Input,
  SubmitButton,
  User,
  List,
  Name,
  Bio,
  Avatar,
  ProfileButton,
  ProfileButtonText,
} from './styles'

import api from '../../services/api'

export default class Main extends Component {
  static navigationOptions = {
    title: 'Usuário',
  }

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  }

  state = {
    newUser: '',
    users: [],
    loading: false,
  }

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users')

    if (users) {
      this.setState({ users: JSON.parse(users) })
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users))
    }
  }

  handleNavigate = user => {
    const { navigation } = this.props
    navigation.navigate('User', { user })
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state
    this.setState({ loading: true })
    await api
      .get(`/users/${newUser}`)
      .then(({ data }) => {
        const { name, login, bio, avatar_url: avatarUrl } = data
        this.setState({
          users: [...users, { name, login, bio, avatarUrl }],
          newUser: '',
        })

        Keyboard.dismiss()
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const { users, newUser, loading } = this.state
    return (
      <Container>
        <Form>
          <Input
            autoCorret={false}
            value={newUser}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Adicionar usuário"
            // eslint-disable-next-line react/jsx-no-bind
            onChangeText={newUser => this.setState({ newUser })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatarUrl }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    )
  }
}
