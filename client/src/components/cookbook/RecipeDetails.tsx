import * as React from 'react'
import { Card, Icon, Button, Container } from 'semantic-ui-react'
import { Recipe } from '../../types/Recipe'

import { History } from 'history'
import { getRecipe } from '../../api/cookbook-api'
import { useQuery } from 'react-query'

interface RecipeDetailsProps {
  match: {
    params: {
      recipeId: string
    }
  }
}

const RecipeListItem = ({ match }: RecipeDetailsProps) => {
  const recipeId = match.params.recipeId
  const { isLoading, error, data } = useQuery(['recipes', recipeId], () =>
    getRecipe(recipeId)
  )

  return <Container>{match.params.recipeId}</Container>
}

export default RecipeListItem
