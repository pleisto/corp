import { Avatar, Col, List, Row, Icon } from '@brickdoc/design-system'
import { Completion, FunctionCompletion, VariableCompletion } from '@brickdoc/formula'
import React from 'react'

export interface AutocompleteListProps {
  completions: Completion[]
}

const renderFunctionPreview = ({ preview }: FunctionCompletion): React.ReactElement => {
  return (
    <>
      <ul>
        <li>description: {preview.description}</li>
        <li>args: {JSON.stringify(preview.args)}</li>
        <li>returns: {preview.returns}</li>
        <li>examples: {JSON.stringify(preview.examples)}</li>
      </ul>
    </>
  )
}
const renderVariablePreview = ({ preview }: VariableCompletion): React.ReactElement => {
  return (
    <>
      <ul>
        <li>definition: {preview.definition}</li>
        <li>value: {String(preview.variableValue.value)}</li>
        <li>type: {preview.variableValue.type}</li>
      </ul>
    </>
  )
}

const renderPreview = (completion: Completion): React.ReactNode => {
  if (completion.kind === 'function') {
    return renderFunctionPreview(completion)
  }

  return renderVariablePreview(completion)
}

export const AutocompleteList: React.FC<AutocompleteListProps> = ({ completions }) => {
  const preview = completions[0] ? renderPreview(completions[0]) : 'Empty!'
  const completeOptions = completions.map(c => ({
    ...c,
    icon: c.kind === 'function' ? <Icon.Table /> : <Icon.Formula />
  }))

  return (
    <Row className="formula-menu-complete">
      <Col span={10}>
        <List
          size="small"
          header={null}
          footer={null}
          dataSource={completeOptions}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta avatar={<Avatar icon={item.icon} />} title={item.name} description={item.namespace} />
            </List.Item>
          )}
        />
      </Col>
      <Col span={14}>
        <div className="formula-menu-complete-preview">{preview}</div>
      </Col>
    </Row>
  )
}
