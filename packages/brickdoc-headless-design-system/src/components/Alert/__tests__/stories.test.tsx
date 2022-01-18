import { composeStories } from '@storybook/testing-react'
import { render } from '@testing-library/react'
import { a11yTest, toStoryTable } from '../../../testHelper'

import * as AlertStories from '../alert.stories'

const storyTable = toStoryTable(Object.values(composeStories(AlertStories)))

it.each(storyTable)('$name should pass the a11y test', async ({ story }) => {
  await a11yTest(story)
})

it.each(storyTable)('$name should match the snapshot', ({ Component }) => {
  const { container } = render(<Component />)
  expect(container).toMatchSnapshot()
})
