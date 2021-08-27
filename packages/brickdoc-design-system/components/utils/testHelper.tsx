import { ReactElement } from 'react'
import { render } from '@testing-library/react'

export function basicRenderTest(element: ReactElement, expectedText: string, expectedClass: string[] = []) {
  const { container, getByText } = render(element)
  expect(getByText(expectedText)).toBeInTheDocument()
  expect([...(container.firstChild as HTMLElement).classList]).toEqual(expect.arrayContaining(expectedClass))
  return { container, getByText }
}
