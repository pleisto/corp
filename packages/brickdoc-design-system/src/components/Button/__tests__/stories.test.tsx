import { composeStories } from '@storybook/testing-react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonHTMLProps } from 'reakit/ts'
import { BtnType, Size } from '..'
import { a11yTest, toStoryTable } from '../../../utilities/testing'
import * as ButtonStories from '../button.stories'

const stories = composeStories(ButtonStories)
const storyTable = toStoryTable(stories)
const { Basic } = stories

describe('Button', () => {
  describe('rendering', () => {
    it.each(storyTable)('$name should pass the a11y test', async ({ story }) => {
      await a11yTest(story)
    })
    it.each(storyTable)('$name should match the snapshot', ({ Component }) => {
      const { container } = render(<Component />)
      expect(container).toMatchSnapshot()
    })
    it.each([{ type: 'primary' }, { type: 'secondary' }, { type: 'danger' }, { type: 'text' }] as Array<{
      type: BtnType
    }>)('should match the snapshot by type "$type"', ({ type }) => {
      const { container } = render(<Basic type={type} />)
      expect(container).toMatchSnapshot()
    })
    it.each([{ size: 'sm' }, { size: 'md' }, { size: 'lg' }] as Array<{
      size: Size
    }>)('should match the snapshot by size "$size"', ({ size }) => {
      const { container } = render(<Basic size={size} />)
      expect(container).toMatchSnapshot()
    })
    it('should match the snapshot as a block button', () => {
      const { container } = render(<Basic block />)
      expect(container).toMatchSnapshot()
    })
  })

  describe('interaction', () => {
    it('should trigger the onClick callback when being clicked', () => {
      const onClick = jest.fn()
      render(<Basic onClick={onClick} />)
      userEvent.click(screen.getByRole('button'))
      expect(onClick).toBeCalledTimes(1)
    })
    it('should not trigger the onClick callback if disabled', () => {
      const onClick = jest.fn()
      render(<Basic onClick={onClick} disabled />)
      // Use `fireEvent` instead of `userEvent` to force perform the click action.
      // Because `userEvent` will throw an error saying that the element is not
      // receiving a user interaction.
      fireEvent.click(screen.getByRole('button'))
      expect(onClick).not.toBeCalledTimes(1)
    })
    it('should not throw an error if the onClick callback is not set', () => {
      render(<Basic />)
      function doClick() {
        userEvent.click(screen.getByRole('button'))
      }
      expect(doClick).not.toThrow()
    })
  })

  describe('as a form button', () => {
    const onSubmit = jest.fn(e => e.preventDefault())
    const onReset = jest.fn()
    const getForm = (htmlType: ButtonHTMLProps['type']) => (
      <form onSubmit={onSubmit} onReset={onReset}>
        <input type="text" name="foo" />
        <Basic htmlType={htmlType} />
      </form>
    )
    afterEach(() => {
      jest.clearAllMocks()
    })
    it('should submit the form when being clicked by htmlType="submit"', () => {
      render(getForm('submit'))
      userEvent.click(screen.getByRole('button'))
      expect(onSubmit).toBeCalledTimes(1)
      expect(onReset).toBeCalledTimes(0)
    })
    it('should reset the form when being clicked by htmlType="reset"', () => {
      render(getForm('reset'))
      userEvent.click(screen.getByRole('button'))
      expect(onSubmit).toBeCalledTimes(0)
      expect(onReset).toBeCalledTimes(1)
    })
  })
})
