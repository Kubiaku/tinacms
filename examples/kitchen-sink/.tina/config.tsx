import { defineConfig } from 'tinacms'
import React from 'react'
import { BiBall, BiBasketball, BiBaseball, BiFootball } from 'react-icons/bi'

const slugify = (values) => {
  return `${(values?.name || values?.title || `document-${Date.now()}`)
    .toLowerCase()
    .split(' ')
    .join('-')}`
}
const router = ({ document, collection }) => {
  return `/${collection.name}/${document._sys.filename}`
}
export default defineConfig({
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'uploads',
      publicFolder: 'public',
    },
  },
  branch: null,
  clientId: null,
  token: null,
  schema: {
    collections: [
      {
        name: 'page',
        label: 'Page',
        path: 'content/pages',
        ui: {
          filename: {
            slugify: slugify,
            readonly: true,
          },
          router,
        },
        templates: [
          {
            label: 'Showcase',
            name: 'showcase',
            ui: {
              defaultItem: {
                title: 'New!',
                _template: 'showcase',
              },
            },
            fields: [
              {
                name: 'title',
                type: 'string',
                required: true,
                isTitle: true,
                ui: {
                  component: ({ input }) => {
                    return (
                      <div className="my-4">
                        <label
                          htmlFor={input.name}
                          className="block text-sm font-medium text-blue-700 underline"
                        >
                          {input.name} (this is a custom component)
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id={input.name}
                            className="py-2 px-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            {...input}
                          />
                        </div>
                      </div>
                    )
                  },
                },
              },
              {
                name: 'items',
                type: 'object',
                ui: {
                  itemProps: (values) => ({
                    label: values?.title || 'Showcase Item',
                  }),
                },
                list: true,
                fields: [
                  {
                    name: 'title',
                    type: 'string',
                    required: true,
                    isTitle: true,
                  },
                  {
                    name: 'description',
                    type: 'rich-text',
                  },
                  {
                    name: 'image',
                    type: 'image',
                  },
                ],
              },
            ],
          },
          {
            label: 'Block Page',
            name: 'blockPage',
            fields: [
              {
                name: 'title',
                type: 'string',
                description:
                  'This is a description that is even longer than the label that is above it.',
                required: true,
                isTitle: true,
              },
              {
                name: 'blocks',
                type: 'object',
                label:
                  'This Here Is A Really Long Label That Hopefully Does Not Break The Layout',
                description:
                  'This is a description that is even longer than the label that is above it, even though that label is very long.',
                list: true,
                templates: [
                  {
                    label: 'Hero',
                    name: 'hero',
                    ui: {
                      itemProps: (item) => {
                        return { label: item?.headline }
                      },
                      defaultItem: {
                        _template: 'hero',
                        headline: 'ok',
                      },
                    },
                    fields: [
                      { type: 'string', name: 'headline' },
                      {
                        type: 'string',
                        name: 'description',
                        ui: { component: 'textarea' },
                      },
                      {
                        type: 'object',
                        name: 'actions',
                        list: true,
                        fields: [
                          {
                            type: 'string',
                            name: 'label',
                          },
                          {
                            type: 'string',
                            name: 'url',
                          },
                          {
                            type: 'string',
                            name: 'variant',
                            options: ['primary', 'secondary', 'simple'],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    label: 'Features',
                    name: 'features',
                    fields: [
                      {
                        type: 'string',
                        name: 'title',
                        ui: { component: 'textarea' },
                      },
                      {
                        label: 'Boolean With Labels',
                        name: 'booleanLabels',
                        type: 'boolean',
                        // @ts-ignore
                        toggleLabels: ['Yes', 'No'],
                      },
                      {
                        label: 'Boolean',
                        name: 'boolean',
                        type: 'boolean',
                      },
                      {
                        label: 'Checkbox Group',
                        name: 'checkbox',
                        type: 'string',
                        list: true,
                        options: [
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'new',
                            label: 'New Releases',
                          },
                          {
                            value: 'music',
                            label: 'Trending Music',
                          },
                          {
                            value: 'art',
                            label: 'Art',
                          },
                        ],
                      },
                      {
                        label: 'Inline Checkbox Group',
                        name: 'checkboxInline',
                        type: 'string',
                        list: true,
                        ui: {
                          component: 'checkbox-group',
                          // @ts-ignore
                          direction: 'horizontal',
                        },
                        options: [
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'new',
                            label: 'New Releases',
                          },
                          {
                            value: 'music',
                            label: 'Trending Music',
                          },
                          {
                            value: 'art',
                            label: 'Art',
                          },
                        ],
                      },
                      {
                        label: 'Tags',
                        name: 'categoriesOther',
                        type: 'string',
                        list: true,
                        ui: {
                          component: 'tags',
                        },
                        options: [
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'new',
                            label: 'New Releases',
                          },
                          {
                            value: 'music',
                            label: 'Trending Music',
                          },
                          {
                            value: 'art',
                            label: 'Art',
                          },
                        ],
                      },
                      {
                        label: 'Radio Group',
                        name: 'radioGroup',
                        type: 'string',
                        ui: {
                          component: 'radio-group',
                        },
                        options: [
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'new',
                            label: 'New Releases',
                          },
                          {
                            value: 'music',
                            label: 'Trending Music',
                          },
                          {
                            value: 'art',
                            label: 'Art',
                          },
                        ],
                      },
                      {
                        label: 'Inline Radio Group',
                        name: 'radioGroupInline',
                        type: 'string',
                        ui: {
                          component: 'radio-group',
                          // @ts-ignore
                          direction: 'horizontal',
                        },
                        options: [
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'new',
                            label: 'New Releases',
                          },
                          {
                            value: 'music',
                            label: 'Trending Music',
                          },
                          {
                            value: 'art',
                            label: 'Art',
                          },
                        ],
                      },
                      {
                        label: 'Button Toggle',
                        name: 'buttonToggle',
                        type: 'string',
                        ui: {
                          component: 'button-toggle',
                        },
                        options: [
                          {
                            value: 'all',
                            label: 'All',
                          },
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'shows',
                            label: 'Shows',
                          },
                        ],
                      },
                      {
                        label: 'Icon Button Toggle',
                        name: 'buttonToggleIcon',
                        type: 'string',
                        ui: {
                          component: 'button-toggle',
                        },
                        options: [
                          {
                            value: 'football',
                            // @ts-ignore
                            icon: BiBall,
                          },
                          {
                            value: 'basketball',
                            // @ts-ignore
                            icon: BiBasketball,
                          },
                          {
                            value: 'baseball',
                            // @ts-ignore
                            icon: BiBaseball,
                          },
                          {
                            value: 'soccer',
                            // @ts-ignore
                            icon: BiFootball,
                          },
                        ],
                      },
                      {
                        label: 'Vertical Button Toggle',
                        name: 'buttonToggleVertical',
                        type: 'string',
                        ui: {
                          component: 'button-toggle',
                          // @ts-ignore
                          direction: 'vertical',
                        },
                        options: [
                          {
                            value: 'all',
                            label: 'All',
                          },
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'shows',
                            label: 'Shows',
                          },
                        ],
                      },
                      {
                        label: 'Select',
                        name: 'select',
                        type: 'string',
                        options: [
                          {
                            value: 'all',
                            label: 'All',
                          },
                          {
                            value: 'movies',
                            label: 'Movies',
                          },
                          {
                            value: 'shows',
                            label: 'Shows',
                          },
                        ],
                      },
                      { type: 'string', name: 'items', list: true },
                    ],
                  },
                  {
                    label: 'CTA',
                    name: 'cta',
                    fields: [
                      { type: 'string', name: 'title' },
                      { type: 'string', name: 'description' },
                      {
                        type: 'object',
                        name: 'actions',
                        list: true,
                        fields: [
                          {
                            type: 'string',
                            name: 'label',
                          },
                          {
                            type: 'string',
                            name: 'url',
                          },
                          {
                            type: 'string',
                            name: 'variant',
                            options: ['primary', 'secondary', 'simple'],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'post',
        label: 'Post',
        path: 'content/post',
        format: 'mdx',
        ui: {
          router,
          filename: {
            slugify,
            readonly: true,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            required: true,
            isTitle: true,
          },
          {
            type: 'reference',
            name: 'author',
            collections: ['author'],
          },
          {
            type: 'string',
            list: true,
            name: 'categories',
            options: [
              { label: 'React', value: 'react' },
              { label: 'Next.js', value: 'nextjs' },
              { label: 'Content Management', value: 'cms' },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            isBody: true,
            templates: [
              {
                name: 'Hero',
                fields: [
                  {
                    name: 'header',
                    type: 'string',
                    isTitle: true,
                    required: true,
                  },
                  {
                    name: 'description',
                    type: 'rich-text',
                  },
                  {
                    name: 'image',
                    type: 'image',
                  },
                ],
              },
            ],
          },
          {
            type: 'image',
            name: 'image',
          },
        ],
      },
      {
        name: 'author',
        label: 'Author',
        path: 'content/authors',
        ui: {
          filename: {
            slugify,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'name',
          },
          {
            type: 'rich-text',
            name: 'bio',
          },
          {
            type: 'string',
            name: 'hobbies',
            list: true,
          },
          {
            type: 'image',
            name: 'image',
          },
        ],
      },
      {
        name: 'documentation',
        label: 'Documentation',
        path: 'content/documentation',
        ui: {
          router,
          filename: {
            slugify,
          },
        },
        fields: [
          {
            type: 'string',
            name: 'title',
            required: true,
            isTitle: true,
          },
          {
            type: 'object',
            name: 'tags',
            list: true,
            fields: [
              {
                type: 'reference',
                name: 'reference',
                collections: ['tag'],
              },
            ],
          },
          {
            type: 'rich-text',
            name: 'body',
            isBody: true,
          },
        ],
      },
      {
        name: 'tag',
        label: 'Tag',
        path: 'content/tags',
        format: 'json',
        fields: [
          {
            type: 'string',
            name: 'title',
            required: true,
            isTitle: true,
          },
          {
            type: 'rich-text',
            name: 'description',
          },
        ],
      },
    ],
  },
})
