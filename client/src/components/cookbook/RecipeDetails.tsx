import * as React from 'react'
import {
  Card,
  Icon,
  Button,
  Container,
  Header,
  Loader,
  List,
  Grid,
  ContainerProps,
  Input,
  Dropdown
} from 'semantic-ui-react'
import { CookingStep, Recipe } from '../../types/Recipe'

import { History } from 'history'
import { getRecipe } from '../../api/cookbook-api'
import { useQuery } from 'react-query'
import { CookingSteps } from './CookingSteps'
import { useState } from 'react'

interface RecipeDetailsProps {
  match: {
    params: {
      recipeId: string
    }
  }
}

const RecipeDetails = ({ match }: RecipeDetailsProps) => {
  const recipeId = match.params.recipeId
  const { isLoading, error, data } = useQuery(['recipes', recipeId], () =>
    getRecipe(recipeId)
  )

  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) return <Loader />

  data.cookingSteps.sort((a: CookingStep, b: CookingStep) => a.order - b.order)

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <Header as="h2">{data.recipeName}</Header>
          </Grid.Column>
          <Grid.Column>
            <Button icon="pencil" onClick={() => setIsEditing(!isEditing)} />
          </Grid.Column>
        </Grid.Row>
        {isEditing ? RednerEditingMode(data) : RenderReadOnly(data)}
      </Grid>
    </Container>
  )
}

const RednerEditingMode = (data: Recipe) => {}

const RenderReadOnly = (data: Recipe) => {
  return (
    <>
      <Grid.Row>
        <Grid.Column width={10}>
          <Header as="h4">
            Prep: {data.preparationInfo.preparationQuantity}{' '}
            {data.preparationInfo.preparationScale} / Cooking:{' '}
            {data.preparationInfo.cookingQuantity}{' '}
            {data.preparationInfo.cookingScale}
          </Header>
          <Container>{data.description}</Container>
        </Grid.Column>
        <Grid.Column width={3}>
          <Card>
            <Card.Content>
              <Card.Header>Ingridients</Card.Header>
              <Card.Description>
                <List>
                  {data.ingridients.map((step: string) => (
                    <List.Item>
                      <List.Icon name="caret right" />
                      <List.Content>{step}</List.Content>
                    </List.Item>
                  ))}
                </List>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={10}>
          <CookingSteps steps={data.cookingSteps} />
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

export default RecipeDetails
