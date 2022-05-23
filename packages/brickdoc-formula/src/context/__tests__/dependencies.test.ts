// /* eslint-disable max-nested-callbacks */
// import { generateVariable, interpret, parse, SuccessParseResult } from '../../grammar/core'
// import { makeContext } from '../../tests'
// import { VariableMetadata, VariableValue } from '../../types'

// describe.skip('Dependency', () => {
//   let ctx: Awaited<ReturnType<typeof makeContext>>

//   beforeEach(async () => {
//     ctx = await makeContext({
//       pages: [
//         {
//           pageName: 'Simple',
//           variables: [
//             { variableName: 'num0', definition: '=1' },
//             { variableName: 'num1', definition: '=2' },
//             { variableName: 'num2', definition: '=num0' },
//             { variableName: 'num3', definition: '=num2 + num1' },
//             { variableName: 'num4', definition: '=num2 + num0' },
//             { variableName: 'num5', definition: '=num3 + num0 + num2' },
//             { variableName: 'num6', definition: '=num4 + num1' }
//           ]
//         }
//       ]
//     })
//   })

//   it('snapshot', async () => {
//     expect(formulaContext.reverseVariableDependencies).toMatchSnapshot()
//     expect(
//       (formulaContext.findVariableById(namespaceId, variableIds[5])!.t.task.variableValue as VariableValue).result
//     ).toEqual({
//       result: 5,
//       type: 'number'
//     })
//     expect(
//       (formulaContext.findVariableById(namespaceId, variableIds[6])!.t.task.variableValue as VariableValue).result
//     ).toEqual({
//       result: 4,
//       type: 'number'
//     })
//     expect(
//       Object.values(formulaContext.variables).map(v => ({
//         ...v.t,
//         cst: null,
//         task: { ...v.t.task, execStartTime: null, execEndTime: null, uuid: null }
//       }))
//     ).toMatchSnapshot()
//   })

//   it('circular dependency check', async () => {
//     const input = `=#${namespaceId}.num6`
//     const meta: VariableMetadata = {
//       namespaceId,
//       variableId: variableIds[0],
//       name: 'num0',
//       input,
//       position: 0,
//       richType: { type: 'normal' }
//     }
//     const { errorMessages } = parse({ formulaContext, meta, interpretContext })
//     expect(errorMessages).toEqual([{ message: 'Circular dependency found', type: 'circular_dependency' }])
//   })

//   it('modify num0 => number', async () => {
//     jest.useRealTimers()
//     const num0 = formulaContext.findVariableById(namespaceId, variableIds[0])!

//     await num0.updateDefinition('=30')

//     expect((num0.t.task.variableValue as VariableValue).result.result).toEqual(30)

//     const num2 = formulaContext.findVariableById(namespaceId, variableIds[2])!
//     expect((num2.t.task.variableValue as VariableValue).result.result).toEqual(30)
//     jest.clearAllTimers()
//   })

//   it('modify num0 => invalid', async () => {
//     jest.useRealTimers()
//     const num0 = formulaContext.findVariableById(namespaceId, variableIds[0])!

//     await num0.updateDefinition('=30foobar')

//     expect((num0.t.task.variableValue as VariableValue).result.result).toEqual('Not all input parsed: foobar')

//     const num2 = formulaContext.findVariableById(namespaceId, variableIds[2])!
//     expect((num2.t.task.variableValue as VariableValue).result.result).toEqual('Not all input parsed: foobar')

//     await num0.updateDefinition('=233')
//     expect((num0.t.task.variableValue as VariableValue).result.result).toEqual(233)
//     expect((num2.t.task.variableValue as VariableValue).result.result).toEqual(233)
//     jest.clearAllTimers()
//   })

//   it('modify num0 => boolean', async () => {
//     jest.useRealTimers()
//     const num0 = formulaContext.findVariableById(namespaceId, variableIds[0])!

//     await num0.updateDefinition('=true')
//     expect((num0.t.task.variableValue as VariableValue).result.result).toEqual(true)

//     await new Promise(resolve => setTimeout(resolve, 50))

//     const num4 = formulaContext.findVariableById(namespaceId, variableIds[4])!
//     expect((num4.t.task.variableValue as VariableValue).result.result).toEqual('Expected number,Cell but got boolean')

//     const num2 = formulaContext.findVariableById(namespaceId, variableIds[2])!
//     expect((num2.t.task.variableValue as VariableValue).result.result).toEqual(true)

//     const num3 = formulaContext.findVariableById(namespaceId, variableIds[3])!

//     // const num1 = formulaContext.findVariable(namespaceId, variableIds[1])!
//     // num3 = num2 + num1 = 3
//     expect((num3.t.task.variableValue as VariableValue).result.result).toEqual('Expected number,Cell but got boolean')
//     jest.clearAllTimers()
//   })

//   it('dependency automatic update', async () => {
//     jest.useRealTimers()
//     // num1 = 2 -> num1 = num0 * 2 + 100 = 102
//     const input = `=#${namespaceId}.num0 * 2 + 100`
//     const meta: VariableMetadata = {
//       namespaceId,
//       variableId: variableIds[1],
//       name: 'num1',
//       input,
//       position: 0,
//       richType: { type: 'normal' }
//     }
//     const parseResult = parse({ formulaContext, meta, interpretContext }) as SuccessParseResult
//     expect(parseResult.errorMessages).toEqual([])
//     const ctx = {
//       formulaContext,
//       meta,
//       interpretContext: { ctx: {}, arguments: [] }
//     }

//     const tempT = await interpret({ ctx, parseResult })
//     const variable = generateVariable({ formulaContext, t: tempT })

//     await variable.save()

//     await new Promise(resolve => setTimeout(resolve, 50))

//     expect(
//       (formulaContext.findVariableById(namespaceId, variableIds[5])!.t.task.variableValue as VariableValue).result
//         .result
//     ).toEqual(105)
//     expect(
//       (formulaContext.findVariableById(namespaceId, variableIds[6])!.t.task.variableValue as VariableValue).result
//         .result
//     ).toEqual(104)
//     expect(formulaContext.reverseVariableDependencies).toMatchSnapshot()
//     expect(
//       Object.values(formulaContext.variables).map(v => ({
//         ...v.t,
//         cst: null,
//         task: { ...v.t.task, execStartTime: null, execEndTime: null, uuid: null }
//       }))
//     ).toMatchSnapshot()

//     jest.clearAllTimers()
//   })
// })
