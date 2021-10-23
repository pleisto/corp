import { BrickdocContext } from '../brickdocContext'

export const rootPath = (context: BrickdocContext): string => {
  if (context.currentUser) {
    return context.lastBlockId ?
      `/${context.lastWebid}/${context.lastBlockId}` :
      `/${context.currentPod.webid}`
  } else {
    return '/accounts/sign_in'
  }
}
