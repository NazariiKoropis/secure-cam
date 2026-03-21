//container
import Container from '@layout/container/Container'

import { FidgetSpinner } from 'react-loader-spinner'

function Loader() {
  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FidgetSpinner
          visible={true}
          height="80"
          width="80"
          ariaLabel="fidget-spinner-loading"
          wrapperStyle={{}}
          wrapperClass="fidget-spinner-wrapper"
          backgroundColor="var(--accent-primary)"
        />
      </div>
    </Container>
  )
}

export default Loader
