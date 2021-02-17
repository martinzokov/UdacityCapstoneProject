import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Card
} from 'semantic-ui-react'
import { useQuery } from 'react-query'
import { getRecipes } from '../../api/cookbook-api'

import Auth from '../../auth/Auth'
import { Recipe } from '../../types/Recipe'
import RecipeListItem from './RecipeItem'

interface CookbookProps {
  auth: Auth
  history: History
}

export const Cookbook = ({ auth, history }: CookbookProps) => {
  const { isLoading, error, data } = useQuery('recipes', getRecipes)

  return (
    <>
      <Button icon onClick={() => history.push(`/recipes/new`)}>
        Add Recipe <Icon name="plus" />
      </Button>
      <Divider></Divider>
      <Card.Group>
        {data ? (
          data.map((item: Recipe) => (
            <RecipeListItem
              history={history}
              key={item.partitionKey}
              recipeItem={item}
            />
          ))
        ) : (
          <></>
        )}
      </Card.Group>
    </>
  )
}
