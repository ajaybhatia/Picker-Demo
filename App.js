import React, { Component } from "react";
import { Platform, RefreshControl } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  Text,
  Right,
  Body,
  Left,
  List,
  ListItem,
  Thumbnail,
  Picker,
  Form,
  Item as FormItem
} from "native-base";
import axios from 'axios';

const Item = Picker.Item;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      isRefreshing: false,
      items: [],
    };
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    await axios.get('https://randomuser.me/api/?results=50')
      .then(res => this.setState({ loaded: true, items: res.data.results }));

  }

  refreshList = () => {
    this.setState({ isRefreshing: true });
    axios.get('https://randomuser.me/api/?results=50')
      .then(res => this.setState({ isRefreshing: false, items: res.data.results }));
  }

  render() {
    if (!this.state.loaded) {
      return <Expo.AppLoading />;
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Picker</Title>
          </Body>
          <Right />
        </Header>
        <Content refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.refreshList}
          />}>
          <List>
            {!this.state.isRefreshing ? this.state.items.map(item => (
              <ListItem avatar key={item.login.username}>
                <Left>
                  <Thumbnail source={{ uri: item.picture.thumbnail }} />
                </Left>
                <Body>
                  <Text>{`${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`}</Text>
                  <Text note>{item.location.city}</Text>
                </Body>
                <Right>
                  <Text note>{item.location.state}</Text>
                </Right>
              </ListItem>
            )) : <Text>Loading...</Text>}
          </List>
        </Content>
      </Container>
    );
  }
}
