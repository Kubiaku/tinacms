import { useForm } from 'tinacms'
import {
  InlineForm,
  InlineGroup,
  InlineGroupControls,
  InlineText,
  InlineTextarea,
  InlineBlocks,
  BlocksControls,
} from 'react-tinacms-inline'

export default function Nesting() {
  const [values, form] = useForm({
    id: 'nesting-example',
    initialValues: {
      title: 'Nesting Example',
      description:
        'This page has a bunch of examples of inline fields in various states of being nested.',
      author: {
        name: 'Nolan',
        description: 'He likes coding in the sun',
        colors: [{ _template: 'color', name: 'Red', color: 'fff' }],
      },
      posts: [
        { _template: 'post', title: 'Post #1' },
        { _template: 'post', title: 'Post #2' },
      ],
      builder: [
        {
          _template: 'row',
          items: [
            {
              _template: 'col',
              items: [
                {
                  _template: 'heading',
                  text: 'A Page Builder',
                  color: 'green',
                },
              ],
            },
            {
              _template: 'col',
              items: [
                {
                  _template: 'paragraph',
                  text: 'This is a paragraph in my page builder',
                },
              ],
            },
          ],
        },
        { _template: 'row', items: [] },
      ],
    },
    label: 'Nesting',
    fields: [],
    onSubmit() {},
  })
  console.log('NESTING', values)
  return (
    <InlineForm form={form} initialStatus="active">
      {/* #web-design */}
      <br />
      <br />
      <br />
      <br />

      {/* Grouped Top-Level Field */}
      <InlineGroup fields={[{ name: 'description', component: 'textarea' }]}>
        <InlineGroupControls>
          <h1>
            <InlineTextarea name="title" focusRing />
          </h1>
          <p>{values.description}</p>
        </InlineGroupControls>
      </InlineGroup>

      {/* Grouped Fields */}
      <InlineGroup
        name="author"
        fields={[
          { name: 'description', component: 'textarea' },
          {
            name: 'colors',
            component: 'blocks',
            // @ts-ignore
            templates: { color: COLORS.color.template },
          },
        ]}
      >
        <InlineGroupControls>
          <h2>Author</h2>
          <InlineText name="name" />
          <p>{values.author.description}</p>
          <InlineBlocks name="colors" blocks={COLORS} />
        </InlineGroupControls>
      </InlineGroup>

      <InlineBlocks name="posts" blocks={POSTS} />
      <hr />
      <h2>Stuff</h2>
      <InlineBlocks name="builder" blocks={PAGE_BUILDER} />
    </InlineForm>
  )
}

const POSTS = {
  post: {
    template: {
      type: 'post',
      label: 'Post',
      key: undefined,
      fields: [{ name: 'summary', component: 'textarea' }],
      defaultItem: {
        title: 'Post #?',
        sumary: 'A new post summary.',
      },
    },
    Component({ index, data }) {
      return (
        <BlocksControls index={index}>
          <h3>
            <InlineTextarea name="title" />
          </h3>
          <p>{data.summary}</p>
        </BlocksControls>
      )
    },
  },
}

const COLORS = {
  color: {
    template: {
      type: 'color',
      label: 'Color',
      key: undefined,
      itemProps: item => ({
        label: `${item.name} – ${item.color}`,
      }),
      fields: [{ name: 'color', component: 'color' }],
      defaultItem: {
        name: 'Red',
        color: 'fff',
      },
    },
    Component({ index, data }) {
      return (
        <BlocksControls index={index}>
          <InlineTextarea name="name" />
          <p>{data.color}</p>
        </BlocksControls>
      )
    },
  },
}

const ROW = {
  template: {
    type: 'row',
    label: 'Row',
    key: undefined,
    defaultItem: {
      items: [],
    },
    fields: [],
  },
  Component({ index, data }) {
    return (
      <BlocksControls index={index}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <InlineBlocks
            name="items"
            blocks={{ col: COL, heading: HEADING, paragraph: PARAGRAPH }}
          />
        </div>
      </BlocksControls>
    )
  },
}

const COL = {
  template: {
    type: 'col',
    label: 'Col',
    key: undefined,
    defaultItem: {
      items: [],
    },
    fields: [],
  },
  Component({ index, data }) {
    return (
      <BlocksControls index={index}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <InlineBlocks
            name="items"
            blocks={{ row: ROW, heading: HEADING, paragraph: PARAGRAPH }}
          />
        </div>
      </BlocksControls>
    )
  },
}

const HEADING = {
  template: {
    type: 'heading',
    label: 'Heading',
    key: undefined,
    defaultItem: {
      text: 'New Heading',
      color: 'black',
    },
    fields: [{ name: 'color', component: 'color' }],
  },
  Component({ index, data }) {
    return (
      <BlocksControls index={index}>
        <h3 style={{ color: data.color }}>
          <InlineTextarea name="text" />
        </h3>
      </BlocksControls>
    )
  },
}

const PARAGRAPH = {
  template: {
    type: 'heading',
    label: 'Heading',
    key: undefined,
    defaultItem: {
      text: 'New Paragraph',
      color: 'black',
    },
    fields: [],
  },
  Component({ index, data }) {
    return (
      <BlocksControls index={index}>
        <p>
          <InlineTextarea name="text" />
        </p>
      </BlocksControls>
    )
  },
}

const PAGE_BUILDER = {
  row: ROW,
}
