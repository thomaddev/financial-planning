import Image from 'next/image'
import RenderMenuItem from '@components/RenderMenuItem'
import CustomButton from '@components/buttons/CustomButton'

interface CustomNoRowsOverlayProps {
  isImage?: boolean
  title: string
  description: string
  isButton?: boolean
  nameBtn?: string
  callFunction?: () => void
}

const CustomNoRowsOverlay = ({
  isImage = true,
  title = '',
  description = '',
  isButton = false,
  nameBtn = '',
  callFunction = () => {},
}: CustomNoRowsOverlayProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {isImage && (
        <Image
          src="/images/NoDataImage.png"
          priority
          alt="No Data"
          width={100}
          height={100}
          style={{ width: '100px', height: '100px' }}
        />
      )}
      <RenderMenuItem topic={title} desc={description} isCenter={true} />
      {isButton && <CustomButton callFunction={callFunction} name={nameBtn} />}
    </div>
  )
}

export default CustomNoRowsOverlay
