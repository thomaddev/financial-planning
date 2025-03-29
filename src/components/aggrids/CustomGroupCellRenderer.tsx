import React, { useCallback, useEffect, useState } from 'react'
import { CustomCellRendererProps } from 'ag-grid-react'
import { ExpandedChangedEvent } from 'ag-grid-community'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTranslations } from 'next-intl'

const CustomGroupCellRenderer = (props: CustomCellRendererProps) => {
  const { node, value } = props
  const [expanded, setExpanded] = useState(node.expanded)
  const t = useTranslations()

  useEffect(() => {
    const expandListener = (event: ExpandedChangedEvent<any>) => setExpanded(event.node.expanded)
    node.addEventListener('expandedChanged', expandListener)
    return () => {
      node.removeEventListener('expandedChanged', expandListener)
    }
  }, [node])

  const onClick = useCallback(() => node.setExpanded(!node.expanded), [node])

  // Handle footer case
  if (node.footer) {
    return (
      <div className="flex w-[283px]">
        <span className="w-[70px]"></span>
        <span className="font-[family-name:var(--font-fontsarabun)] text-[length:var(--description-size)] font-semibold">
          ราคารวม
        </span>
      </div>
    )
  }

  // Handle group row case
  if (node.group) {
    return (
      <div className="flex h-full">
        <div className="h-full flex items-center min-w-[300px] max-w-[300px] pl-[40px] pr-[25px]">
          <div className="w-[233px] flex justify-between items-center">
            <span className="font-[family-name:var(--font-fontsarabun)] text-[length:var(--description-size)] font-semibold">
              {t(`menu.group.${value}.topic`)}
            </span>
            <div
              style={{
                cursor: 'pointer',
                display: 'inline-block',
              }}
              onClick={onClick}
            >
              {expanded ? (
                <KeyboardArrowDownIcon
                  sx={{
                    color: 'var(--text-brand-default)',
                    fontSize: '24px',
                  }}
                />
              ) : (
                <KeyboardArrowRightIcon
                  sx={{
                    color: 'var(--text-brand-default)',
                    fontSize: '24px',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Handle child row case
  const sequence = node.childIndex + 1
  const name = props?.data?.record_name || ''
  return (
    <div className="flex w-[300px]">
      <span className="w-[70px] font-[family-name:var(--font-fontsarabun)] text-[length:var(--description-size)] font-normal">
        {sequence}{' '}
      </span>
      <span className="font-[family-name:var(--font-fontsarabun)] text-[length:var(--description-size)] font-normal">
        {name}
      </span>
    </div>
  )
}

export default CustomGroupCellRenderer
