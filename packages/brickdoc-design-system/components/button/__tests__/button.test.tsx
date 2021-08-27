import * as React from 'react'
import Button from '../button'
import { basicRenderTest } from '../../utils/testHelper'
import { name } from 'faker'

describe('Dashboard', () => {
  it('renders correctly', () => {
    const payload = name.title()
    basicRenderTest(
      <Button shape="circle" size="small" type="primary">
        {payload}
      </Button>,
      payload,
      ['brk-btn', 'brk-btn-sm', 'brk-btn-primary', 'brk-btn-circle']
    )
  })
})
