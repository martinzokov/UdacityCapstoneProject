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
import { searchRecipes } from '../../api/cookbook-api'

import Auth from '../../auth/Auth'
import { Recipe } from '../../types/Recipe'
import RecipeListItem from './RecipeItem'
import queryString from 'query-string'
import { useEffect, useState } from 'react'

interface RecipeSearchProps {
  history: History
  location: {
    search: string
  }
}

export const RecipeSearch = ({ history, location }: RecipeSearchProps) => {
  const searchParam = queryString.parse(location.search)['q'] as string

  const [recipesFound, setRecipesFound] = useState<Recipe[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setLoading(true)
    searchRecipes(searchParam).then((recipes) => {
      setRecipesFound(recipes)
      setLoading(false)
    })
  }, [searchParam])

  if (loading) return <Loader />
  return (
    <>
      Results:
      {recipesFound
        ? recipesFound.map((item: Recipe) => (
            <RecipeListItem
              history={history}
              key={item.partitionKey}
              recipeItem={item}
            />
          ))
        : 'No recipes found'}
    </>
  )
}
