import { debounce } from '@brickdoc/active-support'
import { UnsplashImage } from '@brickdoc/uploader'
import { useState, useRef, useCallback, useEffect, ChangeEvent } from 'react'
import { useExternalProps } from '../../../../../hooks'

const UNSPLASH_PER_PAGE = 20

export function useUnsplashImages(): [UnsplashImage[], (event: ChangeEvent<HTMLInputElement>) => void] {
  const externalProps = useExternalProps()
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([])

  const fetching = useRef(false)
  const lastQuery = useRef('')
  const page = useRef(1)

  const fetchUnsplashImage = useCallback(
    async (query?: string): Promise<void> => {
      if (fetching.current) return

      if (query && query !== lastQuery.current) {
        page.current = 1
        lastQuery.current = query
      }

      fetching.current = true

      try {
        const response = await externalProps.fetchUnsplashImages(lastQuery.current, page.current, UNSPLASH_PER_PAGE)

        if (response.success) {
          setUnsplashImages(prevData => [...(page.current === 1 ? [] : prevData), ...response.data])
          page.current += 1
        }
      } catch (error) {
        console.error(error)
        setUnsplashImages([])
      }

      fetching.current = false
    },
    [externalProps]
  )

  useEffect(() => {
    void fetchUnsplashImage()
  }, [fetchUnsplashImage])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUnsplashSearch = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>): void => {
      const query = event.target.value
      void fetchUnsplashImage(query)
    }, 300),
    []
  )

  return [unsplashImages, handleUnsplashSearch]
}
