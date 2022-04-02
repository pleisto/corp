import { FC } from 'react'
import { ExampleWithCodeFragments, FormulaType, FunctionClause } from '@brickdoc/formula'
import { FormulaEditorContent, useFormulaEditor } from '../../../../editors/formulaEditor'
import { codeFragmentsToJSONContentTotal } from '../../../../helpers'

export interface FunctionPreviewProps {
  functionClause: FunctionClause<FormulaType>
  rootId: string
}

const FormulaEditor: FC<{ example: ExampleWithCodeFragments<FormulaType> }> = ({ example }) => {
  const formulaEditor = useFormulaEditor({
    editorContent: {
      content: codeFragmentsToJSONContentTotal(example.codeFragments),
      input: '',
      position: 0
    },
    editable: false
  })

  return <FormulaEditorContent editor={formulaEditor} editable={false} />
}

export const FunctionPreview: FC<FunctionPreviewProps> = ({ functionClause, rootId }) => {
  return (
    <div className="formula-autocomplete-preview-function">
      <div className="autocomplete-preview-name">
        {functionClause.name} (
        {functionClause.args.map((arg, index) => (
          <span className="autocomplete-preview-arg" key={arg.name}>
            {arg.name}
            {index !== functionClause.args.length - 1 && (
              <span className="autocomplete-preview-arg-separator"> , </span>
            )}
          </span>
        ))}
        )
      </div>
      <div className="autocomplete-preview-desc">{functionClause.description}</div>
      <div className="autocomplete-preview-section">
        <div className="autocomplete-preview-section-head">Inputs</div>
        {functionClause.args.length > 0
          ? functionClause.args.map(arg => (
              <div key={arg.name} className="autocomplete-preview-inputs-arg">
                <span className="autocomplete-preview-input-tag">{arg.name}</span> : {arg.type}
              </div>
            ))
          : 'None.'}
      </div>
      <div className="autocomplete-preview-section">
        <div className="autocomplete-preview-section-head">Outputs</div>
        {functionClause.returns ? (
          <span className="autocomplete-preview-output-tag">{functionClause.returns}</span>
        ) : (
          'None.'
        )}
      </div>
      {functionClause.examples.length > 0 && (
        <div className="autocomplete-preview-section">
          <div className="autocomplete-preview-section-head">Example</div>
          {functionClause.examples.map((example, index) => (
            <div key={index} className="autocomplete-preview-example">
              <FormulaEditor example={example} />
              <br />
              <span className="autocomplete-preview-example-result">={JSON.stringify(example?.output?.result)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
