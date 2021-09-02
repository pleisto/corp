import React from 'react'
import { Table } from '../Table'
import { render, screen, fireEvent } from '@testing-library/react'

// see more tests in e2e testing
describe('Table Sort', () => {
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
            text: 'text',
            select: 'option2'
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
              },
              {
                color: 'color',
                value: 'option2',
                label: 'option2'
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

  it('adds single sort normally', () => {
    render(<Table {...props} />)

    fireEvent.click(screen.getByText('Sort'))
    fireEvent.click(screen.getByText('Add a Sort'))

    expect(screen.getByRole('group')).toBeInTheDocument()
  })
})
