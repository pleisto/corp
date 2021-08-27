import React from 'react'
import { Table } from '../Table'
import { render, screen, fireEvent } from '@testing-library/react'

// see more tests in e2e testing
describe('Table Filter', () => {
  const props: any = {
    editor: {},
    node: {
      attrs: {
        rows: [
          {
            text: 'text',
            select: 'option1'
          },
          {
            text: 'text2',
            select: 'option1'
          }
        ],
        columns: [
          {
            key: 'text',
            title: 'TextColumn',
            type: 'text'
          },
          {
            key: 'select',
            title: 'SelectColumn',
            type: 'select',
            selectOptions: [
              {
                color: 'color',
                value: 'option1',
                label: 'option1'
              }
            ]
          }
        ]
      }
    },
    extension: {
      options: {}
    },
    updateAttributes: () => {}
  }

  it('adds single filter option normally', () => {
    render(<Table {...props} />)

    fireEvent.click(screen.getByText('Filter'))
    fireEvent.click(screen.getByText('Add a Filter'))
    fireEvent.click(screen.getByText('Add a filter'))

    expect(screen.getByRole('group')).toBeInTheDocument()
    expect(screen.getByText('Where')).toBeInTheDocument()
  })

  it('adds group filter option normally', () => {
    render(<Table {...props} />)

    fireEvent.click(screen.getByText('Filter'))
    fireEvent.click(screen.getByText('Add a Filter'))
    fireEvent.click(screen.getByText('Add a filter group'))

    expect(screen.getAllByRole('group')).toHaveLength(2)
  })
})
