import * as React from 'react'
import { Card, Container, Icon, Image } from 'semantic-ui-react'
import { CookingStep } from '../../types/Recipe'

import styled from 'styled-components'

const PaddedContainer = styled(Container)`
  padding-bottom: 10px;
`

export interface CookingStepsProps {
  steps: CookingStep[]
}
export const CookingSteps = ({ steps }: CookingStepsProps) => {
  return (
    <>
      {steps.map((step: CookingStep) => (
        <PaddedContainer>
          <Card fluid>
            <Card.Header>
              <Image size="medium" src={step.imageUrl} />
            </Card.Header>
            <Card.Content>
              <Card.Description>{step.description}</Card.Description>
            </Card.Content>
          </Card>
          {step.order < steps.length - 1 ? (
            <Container textAlign="center">
              <Icon name="arrow circle down" />
            </Container>
          ) : (
            ''
          )}
        </PaddedContainer>
      ))}
    </>
  )
}
