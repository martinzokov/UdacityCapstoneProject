import * as React from 'react'
import {
  Button,
  Card,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  List,
  TextArea
} from 'semantic-ui-react'
import Auth from '../../auth/Auth'
import { CookingSteps } from './CookingSteps'
import { History } from 'history'
import { CookingStep, Recipe } from '../../types/Recipe'
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import styled from 'styled-components'

const PaddedContainer = styled(Container)`
  padding-bottom: 10px;
`
interface EditableRecipeDetailsProps {
  history: History
}

const prepInfoScale = [
  { key: 'minutes', text: 'minutes', value: 'minutes' },
  { key: 'hours', text: 'hours', value: 'hours' }
]
const data: any = {}
export const EditableRecipeDetails = ({
  history
}: EditableRecipeDetailsProps) => {
  const [recipeName, setRecipeName] = useState<string>('')
  const [prepQuantity, setPrepQuantity] = useState<number>(0)
  const [prepScale, setPrepScale] = useState<string>('minutes')
  const [cookingQuantity, setCookingQuantity] = useState<number>(0)
  const [cookingScale, setCookingScale] = useState<string>('minutes')
  const [recipeDescription, setRecipeDescription] = useState<string>('')
  const [ingridients, setIngridients] = useState<string[]>([])
  const [newIngridient, setNewIngridient] = useState<string>('')
  const [cookSteps, setCookingSteps] = useState<CookingStep[]>([])

  const handleNameInput = (event: SyntheticEvent, data: object) => {
    // @ts-ignore
    setRecipeName(data.value)
  }
  const handlePrepQuantityInput = (event: ChangeEvent, data: object) => {
    //@ts-ignore
    setPrepQuantity(parseInt(data.value))
  }
  const handlePrepScaleInput = (event: SyntheticEvent, data: object) => {
    //@ts-ignore
    setPrepScale(data.value)
  }
  const handleCookingQuantityInput = (event: ChangeEvent, data: object) => {
    //@ts-ignore
    setCookingQuantity(parseInt(data.value))
  }
  const handleCookingScaleInput = (event: SyntheticEvent, data: object) => {
    //@ts-ignore
    setCookingScale(data.value)
  }
  const handleDescriptionInput = (event: SyntheticEvent, data: object) => {
    // @ts-ignore
    setRecipeDescription(data.value)
  }
  const handleNewIngridientInput = (event: ChangeEvent, data: object) => {
    //@ts-ignore
    setNewIngridient(data.value)
  }
  const handleAddIngridient = () => {
    if (newIngridient.length >= 1) {
      ingridients.push(newIngridient)
      setIngridients(ingridients)
      setNewIngridient('')
    }
  }
  const handleAddStep = () => {
    let newStep: CookingStep = {
      description: '',
      order: cookSteps.length,
      imageUrl: ''
    }
    let newSteps = [...cookSteps]
    newSteps.push(newStep)
    setCookingSteps(newSteps)
  }
  const handleStepDescriptionInput = (stepIdx: number, description: string) => {
    let step = cookSteps.find((s) => s.order === stepIdx)
    if (step) {
      step.description = description
    }
  }
  return (
    <Form>
      <Input
        fluid
        as="h1"
        placeholder="Recipe name"
        size="large"
        icon="food"
        onChange={handleNameInput}
      />
      <Grid
        container
        padded="horizontally"
        columns={2}
        divided
        doubling
        stackable
      >
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h5">
              Prep:{'  '}
              <Input
                style={{ width: '6em' }}
                type="number"
                //@ts-ignore
                onChange={handlePrepQuantityInput}
                action={
                  <Dropdown
                    button
                    basic
                    floating
                    options={prepInfoScale}
                    defaultValue="minutes"
                    onChange={handlePrepScaleInput}
                  />
                }
              />
            </Header>
            <Header as="h5">
              Cooking:{'  '}
              <Input
                style={{ width: '6em' }}
                type="number"
                onChange={handleCookingQuantityInput}
                action={
                  <Dropdown
                    button
                    basic
                    floating
                    options={prepInfoScale}
                    defaultValue="minutes"
                    onChange={handleCookingScaleInput}
                  />
                }
              />
            </Header>
            <Container>
              <TextArea
                placeholder="Describe recipe"
                style={{ minHeight: 100 }}
                onChange={handleDescriptionInput}
              />
            </Container>
          </Grid.Column>
          <Grid.Column>
            <Card>
              <Card.Content>
                <Card.Header>Ingridients</Card.Header>
                <Card.Description>
                  <List>
                    {ingridients.map((step: string) => (
                      <List.Item key={step}>
                        <List.Icon name="caret right" />
                        <List.Content>{step}</List.Content>
                      </List.Item>
                    ))}
                  </List>
                  <Input
                    value={newIngridient}
                    icon={
                      <Icon
                        onClick={handleAddIngridient}
                        name="plus"
                        circular
                        inverted
                        link
                      />
                    }
                    placeholder="Add ingridient"
                    onChange={handleNewIngridientInput}
                  ></Input>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h3">Cooking steps</Header>
            {cookSteps.map((step: CookingStep) => (
              <PaddedContainer key={step.order}>
                <Card fluid>
                  <Card.Content>
                    <Card.Description>
                      <TextArea
                        onInput={(_, data) =>
                          // @ts-ignore
                          handleStepDescriptionInput(step.order, data.value)
                        }
                      />
                    </Card.Description>
                  </Card.Content>
                </Card>
              </PaddedContainer>
            ))}
            <Button onClick={handleAddStep} icon="plus" />
            {/* <CookingSteps steps={data.cookingSteps} /> */}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  )
}
