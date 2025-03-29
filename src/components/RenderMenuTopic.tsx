import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

type Props = {
  topic: string
  _?: ReactNode
}

const RenderMenuTopic = ({ topic, _ }: Props) => {
  return (
    <Box
      className="item-wrap"
      sx={{
        '&': {},
        '.MuiTypography-nav_menu_topic': {
          fontSize: '18px',
          fontWeight: '500',
        },
      }}
    >
      <div className="menu-item">
        <div>
          <Typography variant={'nav_menu_topic'} component={'p'}>
            {topic}
          </Typography>
        </div>
      </div>
    </Box>
  )
}

export default RenderMenuTopic
