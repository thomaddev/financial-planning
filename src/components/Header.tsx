'use client'
import React from 'react'
import { IconButton, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined'

export default function Header() {
  const t = useTranslations('header')
  const pathname = usePathname()

  return (
    <>
      <Paper
        square
        elevation={0}
        className={
          'h-[var(--header-height)] border-b border-[var(--border-default-default)] bg-white'
        }
      >
        <Grid
          container
          columnSpacing={8}
          alignItems={'center'}
          sx={{ height: '100%', paddingX: 5 }}
        >
          <Grid size={{ sm: 1 }}>
            <Link href="/" className="block relative w-full h-[29px] flex items-center">
              <Image
                src="/images/vise_logo.svg"
                alt="VISE Logo"
                fill
                priority
                className="object-contain max-w-[38px]"
              />
            </Link>
          </Grid>
          <Grid
            size={{ sm: 9 }}
            display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'center'}
            gap={{
              sm: 1,
              md: 1,
              xl: 5,
            }}
          >
            <nav className="flex gap-18 items-center">
              <Link
                href="/plan/my-board"
                className={`text-[length:var(--size-scale01)] transition-all 
                  text-[var(--text-default-default)] font-['Kanit-Regular']
                  hover:font-['Kanit-Medium'] ${
                    pathname.startsWith('/plan') ? 'font-["Kanit-Medium"]' : ''
                  }`}
              >
                {t('plan')}
              </Link>
              {/* <Link
                href="/report"
                className={`text-[length:var(--size-scale01)] transition-all 
                  text-[var(--text-default-default)] font-['Kanit-Regular']
                  hover:font-['Kanit-Medium'] ${
                    pathname.startsWith('/report') ? 'font-["Kanit-Medium"]' : ''
                  }`}
              >
                {t('report')}
              </Link>
              <Link
                href="/configuration"
                className={`text-[length:var(--size-scale01)] transition-all 
                  text-[var(--text-default-default)] font-['Kanit-Regular']
                  hover:font-['Kanit-Medium'] ${
                    pathname.startsWith('/settings') ? 'font-["Kanit-Medium"]' : ''
                  }`}
              >
                {t('configuration')}
              </Link> */}
            </nav>
          </Grid>
          <Grid
            size={{ sm: 2 }}
            display={'flex'}
            justifyContent={'flex-end'}
            alignItems={'center'}
            gap={{
              sm: 1,
              md: 1,
              xl: 5,
            }}
          >
            {/* <Typography
              noWrap
              sx={{
                color: 'var(--tokens-color-gray-base)',
              }}
            >
              {' '}
              {t('budget_year') + '  ' + (_budgetPrepSetting?.budget_year ?? '')}
            </Typography> */}
            <IconButton>
              <MoreVertOutlinedIcon
                sx={{
                  color: 'var(--text-brand-default)',
                  fontSize: '20px',
                }}
              />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
