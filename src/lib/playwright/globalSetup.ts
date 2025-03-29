import dotenv from 'dotenv'

async function globalSetup() {
  dotenv.config({
    path: '.env.test',
    override: true,
  })
}

export default globalSetup
