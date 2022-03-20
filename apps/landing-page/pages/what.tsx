import type { NextPage } from 'next'
import { What } from '@/components/lib'

const WhatPage: NextPage = () => {
  return <What />
}

export async function getServerSideProps() {
  return { props: {} }
}

export default WhatPage
