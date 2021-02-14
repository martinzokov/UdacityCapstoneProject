import React, { ChangeEvent, Component, useState } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Icon, Input, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditTodo } from './components/EditTodo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Todos } from './components/Todos'

import { CookiesProvider } from 'react-cookie'
import { Cookbook } from './components/cookbook/Cookbook'
import { QueryClient, QueryClientProvider } from 'react-query'
import RecipeDetails from './components/cookbook/RecipeDetails'
import { EditableRecipeDetails } from './components/cookbook/EditableRecipeDetails'
import { RecipeSearch } from './components/cookbook/RecipeSerch'

const queryClient = new QueryClient()

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {
  searchTerm: string
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.setState({ searchTerm: '' })
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value })
  }

  handleSearch = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    if (this.state.searchTerm.length > 0) {
      this.setState({ searchTerm: '' })
      this.props.history.push(`/recipes/search?q=${this.state.searchTerm}`)
    }
  }

  render() {
    return (
      <div>
        <CookiesProvider>
          <Segment style={{ padding: '8em 0em' }} vertical>
            <Grid container stackable verticalAlign="middle">
              <Grid.Row>
                <Grid.Column width={16}>
                  <QueryClientProvider client={queryClient}>
                    <Router history={this.props.history}>
                      <Menu>
                        <Menu.Item name="home">
                          <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Input
                            action={{
                              color: 'teal',
                              icon: 'search',
                              onClick: this.handleSearch
                            }}
                            onChange={this.handleSearchTermChange}
                            placeholder="Search..."
                          />
                        </Menu.Item>
                        <Menu.Menu position="right">
                          {this.logInLogOutButton()}
                        </Menu.Menu>
                      </Menu>

                      {this.generateCurrentPage()}
                    </Router>
                  </QueryClientProvider>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </CookiesProvider>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Input
            icon={{ name: 'search', circular: true, link: true }}
            placeholder="Search..."
          />
        </Menu.Item>
        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            // return <Todos {...props} auth={this.props.auth} />
            return <Cookbook {...props} auth={this.props.auth}></Cookbook>
          }}
        />
        <Route
          path="/recipes/new"
          exact
          render={(props) => {
            return <EditableRecipeDetails {...props} />
          }}
        />
        <Route
          path="/recipes/:recipeId/edit"
          exact
          render={(props) => {
            return <EditableRecipeDetails {...props} />
          }}
        />
        <Route
          path="/recipes/search"
          render={(props) => {
            return <RecipeSearch {...props} />
          }}
        />
        <Route
          path="/recipes/:recipeId"
          exact
          render={(props) => {
            return <RecipeDetails {...props} />
          }}
        />

        {/* <Route
          path="/todos/:todoId/edit"
          exact
          render={props => {
            return <EditTodo {...props} auth={this.props.auth} />
          }}
        /> */}

        <Route component={NotFound} />
      </Switch>
    )
  }
}
