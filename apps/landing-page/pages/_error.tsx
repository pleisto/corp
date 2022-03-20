import Error from 'next/error'

function Page({ statusCode }: any) {
  return (
    <div>
      <Error statusCode={statusCode} />
    </div>
  )
}

Page.getInitialProps = ({ res, err }: { res: any; err: any }) => {
  let statusCode = 404
  if (res) {
    statusCode = res ? res.statusCode : err
  }
  return { statusCode }
}

export default Page
