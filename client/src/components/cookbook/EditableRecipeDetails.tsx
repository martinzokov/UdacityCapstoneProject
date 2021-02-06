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
  const [ingridients, setIngridients] = useState<string[]>([])
  const [newIngridient, setNewIngridient] = useState<string>('')
  const [cookSteps, setCookingSteps] = useState<CookingStep[]>([])

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
      <Grid.Row>
        <Grid.Column width={10}>
          <Header as="h5">
            Prep:
            <Input
              size="mini"
              action={
                <Dropdown
                  button
                  basic
                  floating
                  options={prepInfoScale}
                  defaultValue="minutes"
                />
              }
            />
          </Header>
          <Header as="h5">
            Cooking:{' '}
            <Input
              size="mini"
              action={
                <Dropdown
                  button
                  basic
                  floating
                  options={prepInfoScale}
                  defaultValue="minutes"
                />
              }
            />
          </Header>
          <Container>
            <TextArea
              placeholder="Describe recipe"
              style={{ minHeight: 100 }}
            />
          </Container>
        </Grid.Column>
        <Grid.Column width={3}>
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
                    <Button
                      onClick={handleAddIngridient}
                      icon="plus"
                      circular
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
        <Grid.Column width={10}>
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
    </Form>
  )
}
