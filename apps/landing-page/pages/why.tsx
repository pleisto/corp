import type { NextPage } from 'next'
import { Why } from '@/components/lib'

const WhyPage: NextPage = () => {
  return <Why />
}

export async function getServerSideProps() {
  return { props: {} }
}
export default WhyPage
