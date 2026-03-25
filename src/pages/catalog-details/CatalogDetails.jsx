import { useParams } from 'react-router-dom'

function CatalogDetails() {
  const { item_id } = useParams()

  return <div>{item_id}</div>
}

export default CatalogDetails
