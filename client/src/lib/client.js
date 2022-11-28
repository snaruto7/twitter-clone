import sanityClient from '@sanity/client'

export const client = sanityClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: 'v1',
    token: process.env.REACT_APP_SANITY_TOKEN,
    useCdn: false,
})