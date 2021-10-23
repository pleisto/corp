import { useContext } from 'react'
import { SidebarLayoutPage } from '@/common/layouts/SidebarLayoutPage'
import { siderBarVar } from '@/common/reactiveVars'
import { PodCard } from '@/common/components/PodCard'
import { BrickdocContext } from '@/common/brickdocContext'
import { useGetPodsQuery } from '@/BrickdocGraphQL'
import { useNavigate } from 'react-router-dom'
import { Button } from '@brickdoc/design-system'

export const LayoutPage: React.FC = ({ children }) => {
  const { currentPod } = useContext(BrickdocContext)
  const { loading, data } = useGetPodsQuery()
  const navigate = useNavigate()
  if (loading) {
    return <></>
  }
  const pod = data?.pods.find(p => p.webid === currentPod.webid)

  siderBarVar(
    <>
      <h1> {pod?.personal ? 'User' : 'Pod'} Settings </h1>
      <PodCard pod={pod!} />
      <footer>
        <Button block onClick={() => navigate(`/${pod?.webid}`)}>
          Back to Pod
        </Button>
      </footer>
    </>
  )
  return <SidebarLayoutPage>{children}</SidebarLayoutPage>
}
