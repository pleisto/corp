import { type ComponentStory } from '@storybook/react'
import { render, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

export const a11yTest = async (Component: React.FC): Promise<void> => {
  jest.useRealTimers()
  const { container } = render(<Component />)
  await act(async () => {
    expect(await axe(container)).toHaveNoViolations()
  })
}

export interface StoryTableRow<T extends React.FC> {
  name: string
  story: ComponentStory<T>
  Component: React.FC
}

export function toStoryTable<T extends React.FC>(stories: Array<ComponentStory<T>>): Array<StoryTableRow<T>> {
  return stories.map(story => ({
    name: `${story.storyName}`,
    story,
    Component: story as React.FC
  }))
}
