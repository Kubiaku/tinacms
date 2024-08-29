import { LoadingDots } from '@toolkit/form-builder'
import type { Field } from '@toolkit/forms'
import type { TinaCMS } from '@toolkit/tina-cms'
import * as React from 'react'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import { Button } from './components/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './components/command'
import { Popover, PopoverContent, PopoverTrigger } from './components/popover'
import type { InternalSys, ReferenceFieldProps } from './index'

interface ReferenceSelectProps {
  cms: TinaCMS
  input: any
  field: ReferenceFieldProps & Field
}

type Edge = {
  node: Node
}

interface Node {
  id: string
  _internalSys: InternalSys
  //Using uknown type as _values can be any type from the collection user degined in schema
  _values: unknown
}
interface OptionSet {
  collection: string
  edges: Edge[]
}

interface Response {
  collection: {
    documents: {
      edges: {
        node: Node
      }[]
    }
  }
}

const useGetOptionSets = (cms: TinaCMS, collections: string[]) => {
  const [optionSets, setOptionSets] = React.useState<OptionSet[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchOptionSets = async () => {
      const optionSets = await Promise.all(
        collections.map(async (collection) => {
          try {
            const response: Response = await cms.api.tina.request(
              `#graphql
            query ($collection: String!){
              collection(collection: $collection) {
                documents(first: -1) {
                  edges {
                    node {
                      ...on Node {
                        id,
                      }
                      ...on Document {
                        _values
                        _internalSys: _sys {
                          filename
                          path
                        }
                      }
                    }
                  }
                }
              }
            }
            `,
              { variables: { collection } }
            )

            return {
              collection,
              edges: response.collection.documents.edges,
            }
          } catch (e) {
            return {
              collection,
              edges: [],
            }
          }
        })
      )

      setOptionSets(optionSets)
      setLoading(false)
    }

    if (cms && collections.length > 0) {
      fetchOptionSets()
    } else {
      setOptionSets([])
    }
  }, [cms, collections])

  return { optionSets, loading }
}

// function to get the filename from optionSets to display text in the combobox
// file name is used to display text as the title can be nullable (user can define the name rather than title field)
//? Note - This is looking for a field with `name` or `title`
const getFilename = (optionSets: OptionSet[], value: string): string | null => {
  // Flatten the optionSets array to a single array of nodes
  const nodes = optionSets.flatMap((optionSet) =>
    optionSet.edges.map((edge) => edge.node)
  )
  const node = nodes.find((node) => node.id === value)

  return node ? node._internalSys.filename : null
}

const ComboboxDemo: React.FC<ReferenceSelectProps> = ({
  cms,
  input,
  field,
}) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string | null>(input.value)
  const [displayText, setDisplayText] = React.useState<string | null>(null) //store display text for selected option
  const { optionSets, loading } = useGetOptionSets(cms, field.collections)
  const [filteredOptionsList, setFilteredOptionsList] =
    React.useState<OptionSet[]>(optionSets)

  React.useEffect(() => {
    setDisplayText(getFilename(optionSets, value))
    input.onChange(value)
  }, [value, input, optionSets])

  React.useEffect(() => {
    if (field.experimental___filter && optionSets.length > 0) {
      setFilteredOptionsList(field.experimental___filter(optionSets, undefined))
    }
  }, [optionSets, field.experimental___filter])

  if (loading === true) {
    return <LoadingDots color="var(--tina-color-primary)" />
  }

  console.log('Field Props', field)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-52 justify-between"
          >
            <p className="truncate">{displayText ?? 'Choose an option...'}</p>
            {open ? (
              <IoMdArrowDropup size={20} />
            ) : (
              <IoMdArrowDropdown size={20} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 relative">
          <Command
            shouldFilter={!field.experimental___filter}
            filter={(value, search) => {
              //Replace / in the file path with empty string to make it searchable
              if (
                value
                  .toLowerCase()
                  .replace(/\//g, '')
                  .includes(search.toLowerCase())
              )
                return 1
              return 0
            }}
          >
            <CommandInput
              placeholder="Search reference..."
              onValueChange={(search) => {
                if (field.experimental___filter) {
                  setFilteredOptionsList(
                    field.experimental___filter(optionSets, search)
                  )
                }
              }}
            />
            <CommandEmpty>No reference found</CommandEmpty>
            <CommandList>
              {filteredOptionsList.length > 0 &&
                filteredOptionsList?.map(({ collection, edges }: OptionSet) => (
                  <CommandGroup
                    key={`${collection}-group`}
                    heading={collection}
                  >
                    <CommandList>
                      {edges?.map(({ node }) => {
                        const { id, _values } = node

                        return (
                          <CommandItem
                            key={`${id}-option`}
                            value={id}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? '' : currentValue
                              )
                              setOpen(false)
                            }}
                          >
                            <div className="flex flex-col">
                              <div>
                                {field?.optionComponent && _values ? (
                                  field.optionComponent(
                                    _values,
                                    node._internalSys
                                  )
                                ) : (
                                  <span className="text-x">{id}</span>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandList>
                  </CommandGroup>
                ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

export default ComboboxDemo
