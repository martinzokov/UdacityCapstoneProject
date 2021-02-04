import * as React from 'react'
import { Card, Icon, Button } from 'semantic-ui-react'
import { Recipe } from '../../types/Recipe'

import { History } from 'history'

interface RecipeProps {
  recipeItem: Recipe
  history: History
}

const RecipeListItem = ({ recipeItem, history }: RecipeProps) => {
  let description = recipeItem.description
  if (description.length > 100) {
    description = description.substring(0, 100)
    description += '...'
  }

  const handleCardClick = () => {
    history.push(`/recipes/${recipeItem.partitionKey}`)
  }
  return (
    <Card onClick={handleCardClick}>
      <Card.Content>
        <Card.Header>{recipeItem.recipeName}</Card.Header>
        <Card.Description>{recipeItem.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name="clock outline"></Icon>
        Prep: {recipeItem.preparationInfo.preparationQuantity}{' '}
        {recipeItem.preparationInfo.preparationScale}
        {' / '}
        Cooking: {recipeItem.preparationInfo.cookingQuantity}{' '}
        {recipeItem.preparationInfo.cookingScale}
      </Card.Content>
    </Card>
  )
}

export default RecipeListItem
