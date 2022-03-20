import type { NextPage } from 'next'
import { How } from '@/components/lib'

const HowPage: NextPage = () => {
  return <How />
}

export async function getServerSideProps() {
  return { props: {} }
}

export default HowPage
