import React from 'react'
import { useMachine } from '@xstate/react'
import { queryMachine, initialContext } from '../../lib/machines/query-machine'
import { ChevronRightIcon, textFieldClasses, useCMS } from 'tinacms'
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
} from '@heroicons/react/outline'
import { useLocation } from 'react-router-dom'

export const Preview = (props) => {
  const cms = useCMS()
  const location = useLocation()
  // React.useEffect(() => {
  //   console.log(location.search)
  //   const searchParams = new URLSearchParams(location.search).get("iframe-url")
  //   console.log(searchParams.get('iframe-url'))
  // }, [location.search])
  // For some reason I get a warning about the machine changing
  // between renders
  const machine = React.useMemo(
    () =>
      queryMachine.withContext({
        ...initialContext,
        url:
          new URLSearchParams(location.search).get('iframe-url') ||
          localStorage.getItem('tina-url') ||
          '/',
        cms,
        formifyCallback: props.formifyCallback,
      }),
    []
  )
  const [state, send] = useMachine(machine)
  const ref = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      send({ type: 'IFRAME_MOUNTED', value: ref.current })
      window.addEventListener('message', (event) => {
        console.log('parent: event received', event.data.type)
        if (event.data.type === 'open') {
          send({ type: 'ADD_QUERY', value: event.data })
        }
        if (event.data.type === 'close') {
          send({ type: 'REMOVE_QUERY', value: event.data.id })
        }
      })
    }
  }, [ref.current])
  React.useEffect(() => {
    setInterval(() => {
      if (ref.current) {
        const href = ref.current.contentWindow?.location.pathname
        if (href) {
          if (href === 'blank') return

          send({
            type: 'SET_DISPLAY_URL',
            value: href,
          })
        }
      }
    }, 300)
  }, [ref.current])

  return (
    <div className="h-full overflow-scroll">
      <div className="">
        <div className="col-span-5 ">
          <div className="h-screen flex flex-col">
            <div className="col-span-2 bg-gray-50 border-b border-gray-200">
              <div className="px-16 py-3 flex gap-3">
                <div className="relative flex-1">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      send({ type: 'UPDATE_URL' })
                    }}
                  >
                    <input
                      type="text"
                      style={{ borderRadius: '50px' }}
                      className={`${textFieldClasses}`}
                      onChange={(e) =>
                        send({ type: 'SET_INPUT_URL', value: e.target.value })
                      }
                      value={
                        state.context.inputURL !== null
                          ? state.context.inputURL
                          : state.context.displayURL || state.context.url
                      }
                    />
                    <div className="absolute right-2 top-0 bottom-0 flex items-center">
                      <button
                        className={`relative inline-flex items-center px-2 py-2 rounded-full border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 ${
                          state.context.inputURL
                            ? 'border-blue-300 bg-blue-500 text-white hover:bg-blue-400'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        } focus:ring-blue-500 focus:border-blue-500`}
                      >
                        <span className="sr-only">Go</span>
                        <ArrowRightIcon
                          className="h-3 w-3"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </form>
                </div>
                <span className="relative z-0 inline-flex shadow-sm rounded-md">
                  <button
                    type="button"
                    onClick={() => history.back()}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-full border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => history.forward()}
                    className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-full border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </span>
                {/* <span className="relative z-0 inline-flex shadow-sm rounded-md">
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 rounded-l-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <DeviceMobileIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <DeviceTabletIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-full border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <DesktopComputerIcon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </span> */}
              </div>
            </div>
            <div className="relative flex-1 bg-gray-300 col-span-2 overflow-scroll flex items-center justify-center">
              <iframe
                ref={ref}
                className="h-full w-full bg-white"
                src={state.context.url}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
