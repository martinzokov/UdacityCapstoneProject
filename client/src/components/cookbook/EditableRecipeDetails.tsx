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
  Segment,
  TextArea,
  Image
} from 'semantic-ui-react'
import Auth from '../../auth/Auth'
import { CookingSteps } from './CookingSteps'
import { History } from 'history'
import { CookingStep, Recipe, TimeScale } from '../../types/Recipe'
import { ChangeEvent, SyntheticEvent, useState } from 'react'
import styled from 'styled-components'
import {
  createRecipe,
  getRecipe,
  getUploadUrl,
  updateRecipe,
  uploadFile
} from '../../api/cookbook-api'
import { useQuery } from 'react-query'

const PaddedContainer = styled(Container)`
  padding-bottom: 10px;
`
interface EditableRecipeDetailsProps {
  match: {
    params: {
      recipeId: string
    }
  }
  history: History
}

const prepInfoScale = [
  { key: 'minutes', text: 'minutes', value: 'minutes' },
  { key: 'hours', text: 'hours', value: 'hours' }
]
const data: any = {}
export const EditableRecipeDetails = ({
  match,
  history
}: EditableRecipeDetailsProps) => {
  const recipeId = match.params.recipeId

  const { isLoading, error, data } = useQuery(['recipes', recipeId], () =>
    getRecipe(recipeId)
  )
  const editMode = data != undefined
  const [recipeName, setRecipeName] = useState<string>(
    editMode ? data.recipeName : ''
  )
  const [prepQuantity, setPrepQuantity] = useState<number>(
    editMode ? data.preparationInfo.preparationQuantity : 0
  )
  const [prepScale, setPrepScale] = useState<string>(
    editMode ? data.preparationInfo.preparationScale : 'minutes'
  )
  const [cookingQuantity, setCookingQuantity] = useState<number>(
    editMode ? data.preparationInfo.cookingQuantity : 0
  )
  const [cookingScale, setCookingScale] = useState<string>(
    editMode ? data.preparationInfo.cookingScale : 'minutes'
  )
  const [recipeDescription, setRecipeDescription] = useState<string>(
    editMode ? data.description : ''
  )
  const [ingridients, setIngridients] = useState<string[]>(
    editMode ? data.ingridients : []
  )
  const [newIngridient, setNewIngridient] = useState<string>('')
  const [cookSteps, setCookingSteps] = useState<CookingStep[]>(
    editMode ? data.cookingSteps : []
  )

  const fileInputRef = React.createRef()

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
  const [file, setFile] = useState<any>()

  const onFileChange = async (
    stepIdx: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files) return

    setFile(files[0])
    const imageUploadUrls = await getUploadUrl(files[0].type.split('/')[1])
    uploadFile(imageUploadUrls.uploadUrl, file).then(() => {
      let step = cookSteps.find((s) => s.order === stepIdx)
      if (step) {
        step.imageUrl = imageUploadUrls.imgUrl
        setCookingSteps([...cookSteps])
      }
    })
  }

  const handleRemoveImage = (stepIdx: number) => {
    let step = cookSteps.find((s) => s.order === stepIdx)
    if (step) {
      step.imageUrl = ''
      setCookingSteps([...cookSteps])
    }
  }

  const onSaveRecipe = async () => {
    const newOrUpdatedRecipe: Recipe = {
      recipeName: recipeName,
      cookingSteps: cookSteps,
      description: recipeDescription,
      ingridients: ingridients,
      preparationInfo: {
        preparationQuantity: prepQuantity,
        preparationScale: prepScale as TimeScale,
        cookingQuantity: cookingQuantity,
        cookingScale: cookingScale as TimeScale
      }
    }
    if (editMode) {
      newOrUpdatedRecipe.partitionKey = recipeId
      await updateRecipe(newOrUpdatedRecipe).then(() => {
        history.push(`/recipes/${recipeId}`)
      })
    } else {
      await createRecipe(newOrUpdatedRecipe).then(() => {
        history.push('/')
      })
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
        value={recipeName}
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
                value={prepQuantity}
                //@ts-ignore
                onChange={handlePrepQuantityInput}
                action={
                  <Dropdown
                    button
                    basic
                    floating
                    options={prepInfoScale}
                    defaultValue="minutes"
                    value={prepScale}
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
                value={cookingQuantity}
                onChange={handleCookingQuantityInput}
                action={
                  <Dropdown
                    button
                    basic
                    floating
                    value={cookingScale}
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
                value={recipeDescription}
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
                      <Grid columns={2}>
                        <Grid.Row>
                          <Grid.Column width={10}>
                            <TextArea
                              floated="left"
                              value={step.description}
                              onInput={(_, data) =>
                                handleStepDescriptionInput(
                                  step.order,
                                  // @ts-ignore
                                  data.value
                                )
                              }
                            />
                          </Grid.Column>
                          <Grid.Column width={6}>
                            {step.imageUrl.length === 0 ? (
                              <Form.Field>
                                <Button
                                  content="Add Image"
                                  labelPosition="left"
                                  icon="image"
                                  //@ts-ignore
                                  onClick={() => fileInputRef.current.click()}
                                />
                                <input
                                  //@ts-ignore
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/jpeg"
                                  hidden
                                  onChange={(event) =>
                                    onFileChange(step.order, event)
                                  }
                                />
                              </Form.Field>
                            ) : (
                              <Container>
                                <Image src={step.imageUrl} />
                                <Icon
                                  link
                                  circular
                                  inverted
                                  style={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 20
                                  }}
                                  name="close"
                                  onClick={() => handleRemoveImage(step.order)}
                                />
                              </Container>
                            )}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </PaddedContainer>
            ))}
            <Button onClick={handleAddStep} icon="plus" />
          </Grid.Column>
        </Grid.Row>
        <Button onClick={onSaveRecipe}>Save Recipe</Button>
      </Grid>
    </Form>
  )
}
