'use client'

import { Box, Button, Container, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NotFound() {
  const router = useRouter()

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            height: '300px',
            mb: 4,
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          <Image
            src="/images/404.svg"
            alt="404 Illustration"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 700,
            color: 'primary.main',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 600,
            mb: 3,
            color: 'text.primary',
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: 'text.secondary',
            mb: 4,
            maxWidth: '600px',
          }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.back()}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Go Back
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/')}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: '30px',
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            Return Home
          </Button>
        </Box>
      </Box>

      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </Container>
  )
} 