'use client'
import React from 'react'
import { List, ListItem } from '@mui/material'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import { getDataTestAttr } from '@/utils/helper'

interface SideFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

interface StyledListItemProps {
  selected?: boolean
}

const ListItem1 = styled(ListItem)<StyledListItemProps>(({ selected }: any) => ({
  ':before': {
    content: '""',
    background: selected ? 'var(--tokens-color-primary-blue)' : 'var(--tokens-color-line-stroke)',
    position: 'absolute',
    width: '2px',
    height: '100%',
    top: 0,
    transition: 'height 0.5s ease',
  },
  ':after': {
    content: '""',
    height: 0,
    position: 'absolute',
    width: '2px',
    top: 0,
    transition: 'height 0.5s ease',
  },
  ':hover': {
    ':after': {
      background: 'var(--tokens-color-primary-blue)',
      height: '100%',
    },
  },
  a: {
    color: selected ? 'var(--tokens-color-primary-blue)' : 'var(--tokens-color-text)',
    paddingLeft: 23,
  },
}))

export default function SideFilter({ selectedCategory, onCategoryChange }: SideFilterProps) {
  // const searchParams = useSearchParams();
  // const categoryQuery = React.useMemo(() => {
  //   return searchParams.get('cate');
  // }, [searchParams.get('cate')]);
  const t = useTranslations()

  return (
    <List>
      <ListItem1
        selected={selectedCategory === 'all'}
        onClick={() => onCategoryChange('all')}
        {...getDataTestAttr('filter-all')}
      >
        <Link href="/?cate=all" replace className="w-auto">
          {t('budget_category.all')}
        </Link>
      </ListItem1>
      <ListItem1
        selected={selectedCategory === 'revenue'}
        onClick={() => onCategoryChange('revenue')}
        {...getDataTestAttr('filter-revenue')}
      >
        <Link href="/?cate=revenue" replace>
          {t('budget_category.revenue')}
        </Link>
      </ListItem1>
      <ListItem1
        selected={selectedCategory === 'expense'}
        onClick={() => onCategoryChange('expense')}
        {...getDataTestAttr('filter-expense')}
      >
        <Link href="/?cate=expense" replace>
          {t('budget_category.expense')}
        </Link>
      </ListItem1>
      <ListItem1
        selected={selectedCategory === 'project'}
        onClick={() => onCategoryChange('project')}
        {...getDataTestAttr('filter-project')}
      >
        <Link href="/?cate=project" replace>
          {t('budget_category.project')}
        </Link>
      </ListItem1>
    </List>
  )
}
