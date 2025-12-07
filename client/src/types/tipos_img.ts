import { Dispatch, SetStateAction } from 'react'
import { Id } from '../../convex/_generated/dataModel'

export interface GenerateThumbnailProps {
  setImage: Dispatch<SetStateAction<string>>
  setImageStorageId: Dispatch<SetStateAction<Id<'_storage'> | null>>
  image: string
}
