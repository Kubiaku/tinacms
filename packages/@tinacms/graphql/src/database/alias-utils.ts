import { Templateable, TinaFieldEnriched } from '@tinacms/schema-tools/src'

export const replaceAliasesWithNames = (template: Templateable, obj: any) => {
  if ((template as any).list) {
    return (obj as any[]).map((item) => {
      const foo = getTemplateForData(template, item).fields
      return _replaceAliasesWithNames(foo, item)
    })
  } else {
    return _replaceAliasesWithNames(
      getTemplateForData(template, obj).fields,
      obj
    )
  }
}

const _replaceAliasesWithNames = (fields: TinaFieldEnriched[], obj: any) => {
  const output: object = {}

  Object.keys(obj).forEach((key) => {
    const field = fields.find(
      (fieldWithMatchingAlias) =>
        (fieldWithMatchingAlias?.alias || fieldWithMatchingAlias?.name) === key
    )

    output[field?.name || key] =
      field?.type == 'object'
        ? replaceAliasesWithNames(field as any, obj[key])
        : obj[key]
  })

  return output
}

const getTemplateKey = (field) => {
  //return "_template"
  // Do some extra work to allow custom _template keys

  const DEFAULT_TEMPLATE_KEY = '_template'
  if (field.templates?.length) {
    const templateField = field.templates[0]?.fields?.find(
      (field) => field.name === DEFAULT_TEMPLATE_KEY
    )
    return templateField?.alias || DEFAULT_TEMPLATE_KEY
  }
  return DEFAULT_TEMPLATE_KEY
}

const getTemplateForData = (field: any, data: any) => {
  if (field.templates?.length) {
    const templateKey = getTemplateKey(field)

    if (data[templateKey]) {
      return field.templates.find(
        (template) => template.name === data[templateKey]
      )
    }
  } else {
    return field
  }

  throw new Error('No template found for field ' + field.name)
}

export const replaceKeysWithAliases = (
  template: Templateable,
  obj: any
): object => {
  const output: object = {}
  Object.keys(obj).forEach((key) => {
    const field = template.fields.find((field) => field.name === key)

    const outputKey = field?.alias || key
    //TODO - Handle nested aliases better. We should instead check on object fieldtype, as we're likely not handling arrays properly
    output[outputKey] =
      typeof obj[key] === 'object'
        ? replaceKeysWithAliases(template, obj[key])
        : obj[key]
  })
  return output
}