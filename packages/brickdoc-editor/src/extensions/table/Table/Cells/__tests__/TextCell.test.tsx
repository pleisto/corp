import React from 'react'
import { TextCell } from '../TextCell'
import { render, screen, fireEvent } from '@testing-library/react'

describe('TextCell', () => {
  const props: any = {
    value: 'text',
    resetActiveStatus: () => {},
    updateActiveStatus: () => {},
    cell: {
      row: {
        index: 0,
        original: {
          id: 'id'
        }
      },
      column: {
        id: 'columnId'
      }
    }
  }
  it('matches correct snapshot', () => {
    const { container } = render(<TextCell {...props} />)

    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders correctly', () => {
    render(<TextCell {...props} />)

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText(props.value)).toBeInTheDocument()
  })

  it('turns into editing status when click text cell', () => {
    render(<TextCell {...props} />)

    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByDisplayValue(props.value)).toBeInTheDocument()
  })

  it('updates data when change input value', () => {
    const newValue = 'newValue'
    const updateData = jest.fn()

    render(<TextCell {...props} updateData={updateData} />)
    fireEvent.click(screen.getByRole('button'))
    const input = screen.getByDisplayValue(props.value)
    fireEvent.change(input, { target: { value: newValue } })

    expect(updateData).toBeCalledTimes(1)
    expect(updateData).toBeCalledWith(props.cell.row.original.id, props.cell.column.id, newValue)
  })

  it('turns into text when blurring', () => {
    render(<TextCell {...props} />)
    fireEvent.click(screen.getByRole('button'))
    const input = screen.getByDisplayValue(props.value)
    input.focus()
    input.blur()

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
