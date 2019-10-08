import * as React from 'react'
import { FieldProps } from './fieldProps'
import styled from 'styled-components'
import { font, color } from '@tinacms/styles'

type InputFieldType<ExtraFieldProps, InputProps> = FieldProps<InputProps> &
  ExtraFieldProps

// Wraps the Field component in labels describing the field's meta state
// Add any other fields that the Field component should expect onto the ExtraFieldProps generic type
export function wrapFieldsWithMeta<ExtraFieldProps = {}, InputProps = {}>(
  Field:
    | React.StatelessComponent<InputFieldType<ExtraFieldProps, InputProps>>
    | React.ComponentClass<InputFieldType<ExtraFieldProps, InputProps>>
) {
  return (props: InputFieldType<ExtraFieldProps, InputProps>) => (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor={name}>
          {props.field.label || props.field.name}
          {props.field.description && (
            <FieldDescription>{props.field.description}</FieldDescription>
          )}
        </FieldLabel>
        <Field {...props} />
        {props.meta.error && <FieldError>{props.meta.error}</FieldError>}
      </FieldWrapper>
    </>
  )
}

// Styling
const FieldWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`

const FieldLabel = styled.label`
  display: block;
  font-size: ${font.size(1)};
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.35;
  color: ${color.grey(8)};
  margin-bottom: 0.5rem;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
`

const FieldDescription = styled.p`
  color: ${color.grey(6)};
  font-size: 0.65rem;
  font-style: italic;
  font-weight: lighter;
  padding-top: 0.25rem;
`

const FieldError = styled.span`
  display: block;
  color: red;
  font-size: ${font.size(1)};
  margin-top: 0.5rem;
  font-weight: 500;
`
